# PM Internship AI Navigator

PM Internship AI Navigator is a full-stack student internship discovery app. Students create a profile, upload a resume, receive AI-extracted skills and project highlights, and explore internship recommendations ranked against their interests, skills, location, and work preferences.

## Features

- Clerk authentication with sign-in and sign-up flows.
- Four-step onboarding for education, skills, career interests, work mode, and city.
- Supabase persistence for profiles, skills, resumes, AI analysis, internships, and saved internships.
- Supabase Storage uploads for PDF resumes.
- Server-side PDF text extraction with `pdf-parse`.
- Structured Gemini `gemini-2.5-flash` resume analysis.
- Personalized internship ranking based on the student's profile.
- Bookmarking for saved internship opportunities.
- Pinecone seeding script for semantic internship search embeddings.

## Technology

- React 19 and TanStack Start
- TypeScript and Vite
- Clerk authentication
- Supabase Database and Storage
- Google Gemini via `@google/genai`
- Pinecone vector database
- Tailwind CSS and Radix UI

## Requirements

- Node.js 20 or newer
- npm
- Python 3.10 or newer for the Pinecone seeding script
- A Clerk application
- A Supabase project with the required tables and `resumes` Storage bucket
- A Google Gemini API key
- A Pinecone account and `internships-index` index when using vector seeding

## Local Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/prajapatipawan3012-max/pixel-perfect-show-6809.git
   cd pixel-perfect-show-6809
   npm install
   ```

2. Create a `.env` file in the project root. Never commit this file.

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
   GEMINI_API_KEY=your_gemini_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=internships-index
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite.

## Supabase and Clerk Configuration

The app forwards a Clerk JWT to Supabase so database and Storage requests can be protected by Row Level Security.

1. In Clerk, create a JWT template named `supabase` containing the standard `sub` claim.
2. In Supabase, create the application tables and the `resumes` Storage bucket.
3. Run [`supabase/rls.sql`](supabase/rls.sql) in the Supabase SQL Editor.
4. Confirm that the profile `user_id` column stores the Clerk user ID.

The SQL policies restrict profile-owned records to the signed-in Clerk user while allowing internship listings to be read publicly.

## Pinecone Seeding

The repository includes [`internships_1000.csv`](internships_1000.csv) and [`seed_pinecone.py`](seed_pinecone.py). The script reads all 1,000 internship records, creates 768-dimensional Gemini embeddings, and upserts them to Pinecone in batches of 50.

Install the Python dependencies:

```bash
python -m pip install python-dotenv google-genai pinecone
```

Run the seeder from the project root:

```bash
python seed_pinecone.py
```

The script loads keys from `.env`, reports batch progress, waits between requests, and logs row-level failures without stopping the complete import.

## Useful Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
npm run format    # Format the project with Prettier
```

## Project Structure

```text
src/
  components/     Shared UI components and design primitives
  context/        Local user state and persistence
  data/           Demo fallback internship data
  lib/            Supabase, Gemini, error, and utility modules
  routes/         TanStack file-based application routes
supabase/
  rls.sql         Database and Storage Row Level Security policies
public/
  logo.png        Application logo
seed_pinecone.py  Pinecone vector index seeder
```

## Security Notes

- Keep `.env` and all API keys out of version control.
- Never use a Supabase service-role key in browser code.
- Gemini parsing runs through a server function so the Gemini API key is not exposed to the browser.
- Review and test RLS policies before deploying to production.

## License

This project is maintained for the PM Internship AI Navigator application.
