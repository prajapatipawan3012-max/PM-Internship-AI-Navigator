import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FileText, Sparkles, UploadCloud } from "lucide-react";
import { AppHeader, btnOutline, btnPrimary, Card, SkillChip } from "@/components/ui-bits";
import { useUser } from "@/context/UserContext";

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

const EXTRACTED = ["Python", "SQL", "Git", "HTML", "Data Analysis"];

function ResumeUpload() {
  const { setCompletion, profile, setProfile } = useUser();
  const [file, setFile] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return;
    setProgress(0);
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 4)), 80);
    return () => clearInterval(t);
  }, [file]);

  const done = progress >= 100;
  useEffect(() => {
    if (done) {
      setCompletion(85);
      setProfile({ ...profile, skills: Array.from(new Set([...profile.skills, ...EXTRACTED])) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const navigate = useNavigate();
  const proceed = () => {
    if (done) setCompletion(85);
    navigate({ to: "/dashboard" });
  };
  const pick = (f?: File) => f && setFile(f.name);

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
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed bg-card p-10 text-center transition ${drag ? "border-primary bg-secondary" : "border-border hover:border-primary"}`}
        >
          <UploadCloud className="h-10 w-10 text-primary" />
          <p className="mt-3 font-semibold text-foreground">Drag & drop your PDF resume</p>
          <p className="text-sm text-muted-foreground">or click to browse (PDF, max 5MB)</p>
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </div>

        {file && (
          <Card>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="truncate text-sm font-medium text-foreground">{file}</span>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                {done ? "Analysis complete" : `Gemini AI is analyzing your resume... ${Math.min(progress, 85)}%`}
              </span>
              <span className="font-semibold text-primary">{Math.min(progress, 100)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </Card>
        )}

        {done && (
          <Card>
            <h2 className="font-semibold text-foreground">Extracted from your resume</h2>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXTRACTED.map((s) => <SkillChip key={s} skill={s} kind="match" />)}
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project highlights</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
              <li>Student attendance dashboard built with Python & SQL</li>
              <li>Sales data analysis of 10k rows with insights report</li>
              <li>Personal portfolio website hosted on GitHub Pages</li>
            </ul>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={proceed} className={btnPrimary}>Proceed to Dashboard</button>
          <Link to="/dashboard" className={btnOutline}>Skip for now, use manual profile</Link>
        </div>
      </main>
    </div>
  );
}
