import { GoogleGenAI } from "@google/genai";
import { createServerFn } from "@tanstack/react-start";
import type { Buffer } from "node:buffer";

export type ResumeExtraction = {
  degree: string;
  field_of_study: string;
  technical_skills: string[];
  career_interests: string[];
  project_highlights: string[];
};

export async function parseResumePDF(fileOrBuffer: File | Buffer): Promise<ResumeExtraction> {
  const { PDFParse } = await import("pdf-parse");
  const bytes = fileOrBuffer instanceof Uint8Array
    ? fileOrBuffer
    : new Uint8Array(await fileOrBuffer.arrayBuffer());
  const parser = new PDFParse({ data: bytes });

  try {
    const textResult = await parser.getText();
    const resumeText = textResult.text.trim();
    if (!resumeText) throw new Error("No readable text was found in the PDF.");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the server.");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract the student's resume details from the text below. Return only the requested JSON object.\n\n${resumeText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            degree: { type: "STRING" },
            field_of_study: { type: "STRING" },
            technical_skills: { type: "ARRAY", items: { type: "STRING" } },
            career_interests: { type: "ARRAY", items: { type: "STRING" } },
            project_highlights: { type: "ARRAY", items: { type: "STRING" } },
          },
          required: ["degree", "field_of_study", "technical_skills", "career_interests", "project_highlights"],
        },
      },
    });

    if (!response.text) throw new Error("Gemini returned an empty response.");
    return JSON.parse(response.text) as ResumeExtraction;
  } finally {
    await parser.destroy();
  }
}

export const geminiResumeParser = createServerFn({ method: "POST" })
  .validator((data: { pdfBase64: string }) => data)
  .handler(async ({ data }) => parseResumePDF(Buffer.from(data.pdfBase64, "base64")));