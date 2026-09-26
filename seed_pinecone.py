import csv
import json
import time
import os
from dotenv import load_dotenv
from pinecone import Pinecone
from google import genai

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")

if not PINECONE_API_KEY:
    raise ValueError("❌ Missing PINECONE_API_KEY in .env file")
if not GEMINI_API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env file")

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("internships-index")
client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "text-embedding-004"
BATCH_SIZE = 50

csv_file_path = "internships_1000.csv"

print(f"🚀 Seeding Pinecone using Batch Embedding with '{MODEL_NAME}'...")

# 1. Read CSV into memory
records = []
with open(csv_file_path, mode="r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for idx, row in enumerate(reader):
        skills_list = json.loads(row["required_skills"]) if row.get("required_skills") else []
        skills_str = ", ".join(skills_list)
        text_to_embed = f"Role: {row['title']}. Sector: {row['sector']}. Location: {row['location']}. Skills: {skills_str}. Description: {row['description']}"
        
        records.append({
            "id": str(row.get("id", f"internship_{idx + 1}")),
            "text": text_to_embed,
            "metadata": {
                "title": row["title"],
                "company": row["company"],
                "sector": row["sector"],
                "location": row["location"],
                "work_mode": row["work_mode"],
                "stipend": row["stipend"]
            }
        })

print(f"📦 Total records loaded: {len(records)}. Processing in batches of {BATCH_SIZE}...")

# 2. Process in batches (20 requests total instead of 1,000)
success_count = 0
for i in range(0, len(records), BATCH_SIZE):
    batch = records[i:i + BATCH_SIZE]
    batch_texts = [item["text"] for item in batch]
    
    try:
        # Single API call for 50 items
        response = client.models.embed_content(
            model=MODEL_NAME,
            contents=batch_texts,
        )
        
        # Extract embeddings
        embeddings_list = response.embeddings
        
        # Prepare vectors for Pinecone
        vectors_to_upsert = []
        for j, item in enumerate(batch):
            vector_vals = embeddings_list[j].values
            vectors_to_upsert.append({
                "id": item["id"],
                "values": vector_vals,
                "metadata": item["metadata"]
            })
            
        # Upsert batch to Pinecone
        index.upsert(vectors=vectors_to_upsert)
        success_count += len(vectors_to_upsert)
        print(f"✅ Upserted {success_count}/{len(records)} vectors to Pinecone...")
        time.sleep(0.5)

    except Exception as e:
        print(f"❌ Error on batch {i // BATCH_SIZE + 1}: {e}")
        time.sleep(5)

print(f"\n🎉 Complete! Successfully seeded {success_count} vectors into Pinecone.")