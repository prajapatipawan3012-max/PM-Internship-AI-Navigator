import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, Sparkles, UploadCloud } from "lucide-react";
import { useUser as useClerkUser } from "@clerk/tanstack-react-start";
import { AppHeader, btnOutline, btnPrimary, Card, SkillChip } from "@/components/ui-bits";
import { useUser } from "@/context/UserContext";
import { geminiResumeParser } from "@/lib/geminiResumeParser";
import { getStudentProfile, saveAIAnalysis, saveStudentSkills, updateProfileCompletion, uploadResumePDF } from "@/lib/supabaseDb";

export const Route = createFileRoute("/resume-upload")({
  head: () => ({
    meta: [
      { title: "Upload your resume — PM Internship AI Navigator" },
      { name: "description", content: "Upload your PDF resume and let AI extract your skills and projects." },
      { property: "og:title", content: "Upload your resume for AI analysis" },
      { property: "og:description", content: "AI extracts skills and project highlights from your resume." },
    ],
  }),
  component: ResumeUpload,
});

type Analysis = {
  technical_skills: string[];
  project_highlights: string[];
};

function ResumeUpload() {
  const { setCompletion, profile, setProfile } = useUser();
  const { user } = useClerkUser();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [status, setStatus] = useState("Select a PDF resume to begin.");
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState(false);

  const processResume = async (file?: File) => {
    if (!file || file.type !== "application/pdf") {
      setStatus("Please select a PDF file.");
      return;
    }
    if (!user) {
      setStatus("Please sign in before uploading your resume.");
      return;
    }

    setSelectedFile(file);
    setAnalysis(null);
    setProgress(10);
    setStatus("Uploading your resume...");

    try {
      const savedProfile = await getStudentProfile(user.id);
      if (!savedProfile?.id) throw new Error("Complete your profile before uploading a resume.");

      const resume = await uploadResumePDF(savedProfile.id, user.id, file);
      setProgress(45);
      setStatus("Reading your resume with Gemini...");

      const pdfBase64 = arrayBufferToBase64(await file.arrayBuffer());
      const extracted = await geminiResumeParser({ data: { pdfBase64 } });
      setProgress(75);

      await saveStudentSkills(savedProfile.id, extracted.technical_skills, "Resume_AI");
      await updateProfileCompletion(savedProfile.id, 85);
      if (resume?.id) await saveAIAnalysis(savedProfile.id, resume.id, extracted);

      setAnalysis(extracted);
      setProfile({
        ...profile,
        skills: Array.from(new Set([...profile.skills, ...extracted.technical_skills])),
      });
      setCompletion(85);
      setProgress(100);
      setStatus("Analysis complete. Redirecting to your dashboard...");
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Unable to process resume", error);
      setProgress(0);
      setStatus(error instanceof Error ? error.message : "Unable to process this resume.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload your resume</h1>
          <p className="mt-1 text-sm text-muted-foreground">We'll extract skills and projects to improve your matches.</p>
        </div>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(event) => { event.preventDefault(); setDrag(false); void processResume(event.dataTransfer.files[0]); }}
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed bg-card p-10 text-center transition ${drag ? "border-primary bg-secondary" : "border-border hover:border-primary"}`}
        >
          <UploadCloud className="h-10 w-10 text-primary" />
          <p className="mt-3 font-semibold text-foreground">Drag & drop your PDF resume</p>
          <p className="text-sm text-muted-foreground">or click to browse (PDF, max 5MB)</p>
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => void processResume(event.target.files?.[0])} />
        </div>

        {selectedFile && (
          <Card>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="truncate text-sm font-medium text-foreground">{selectedFile.name}</span>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Sparkles className="h-4 w-4 text-primary" />{status}</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          </Card>
        )}

        {analysis && (
          <Card>
            <h2 className="font-semibold text-foreground">Extracted from your resume</h2>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">{analysis.technical_skills.map((skill) => <SkillChip key={skill} skill={skill} kind="match" />)}</div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project highlights</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">{analysis.project_highlights.map((project) => <li key={project}>{project}</li>)}</ul>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => navigate({ to: "/dashboard" })} className={btnPrimary}>Proceed to Dashboard</button>
          <Link to="/dashboard" className={btnOutline}>Skip for now, use manual profile</Link>
        </div>
      </main>
    </div>
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}
