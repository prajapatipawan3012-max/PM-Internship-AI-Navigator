import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Globe, Home, Plus } from "lucide-react";
import { AppHeader, btnOutline, btnPrimary, Card, inputCls } from "@/components/ui-bits";
import { useUser } from "@/context/UserContext";
import { useUser as useClerkUser } from "@clerk/tanstack-react-start";
import { saveStudentProfile, saveStudentSkills } from "@/lib/supabaseDb";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Create your profile — PM Internship AI Navigator" },
      { name: "description", content: "Tell us about your education, skills, goals and location in 4 quick steps." },
      { property: "og:title", content: "Create your student profile" },
      { property: "og:description", content: "A 4-step wizard to set up your internship matching profile." },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["Education", "Skills", "Career Goals", "Location"];
const SKILLS = ["Python", "SQL", "JavaScript", "HTML", "React", "Machine Learning", "Data Analysis", "Git", "Linux"];
const INTERESTS = ["Software Development", "AI/ML", "Data Science", "Cybersecurity", "Cloud/DevOps"];
const MODES = [
  { v: "Remote", icon: Globe },
  { v: "Hybrid", icon: Home },
  { v: "On-site", icon: Building2 },
];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-foreground">{children}</label>;
}

function Onboarding() {
  const { profile, setProfile, setCompletion } = useUser();
  const { user } = useClerkUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [p, setP] = useState(profile);
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);
  const toggle = (key: "skills" | "interests", v: string) =>
    setP({ ...p, [key]: p[key].includes(v) ? p[key].filter((x) => x !== v) : [...p[key], v] });
  const addCustom = () => {
    const v = custom.trim();
    if (v && !p.skills.includes(v)) setP({ ...p, skills: [...p.skills, v] });
    setCustom("");
  };
  const canContinue = step === 0
    ? Boolean(p.name.trim() && p.degree && p.gradYear && p.field.trim())
    : step === 2
      ? Boolean(p.interests.length && p.careerGoal.trim())
      : step === 3
        ? Boolean(p.city.trim())
        : true;

  const continueStep = () => {
    if (!canContinue) {
      toast.error("Please complete the required fields before continuing.");
      return;
    }
    setStep(step + 1);
  };

  const finish = async () => {
    if (!canContinue || saving) {
      if (!canContinue) toast.error("Please choose a work mode and enter your city.");
      return;
    }
    if (!user) {
      toast.error("Please sign in before saving your profile.");
      return;
    }

    setSaving(true);
    try {
      const savedProfile = await saveStudentProfile({
        user_id: user.id,
        full_name: p.name,
        degree: p.degree,
        field_of_study: p.field,
        graduation_year: p.gradYear,
        interests: p.interests,
        career_goal: p.careerGoal,
        work_mode: p.workMode || "Remote",
        city: p.city,
      });
      if (!savedProfile?.id) throw new Error("Profile was not saved.");
      await saveStudentSkills(savedProfile.id, p.skills, "onboarding");
      setProfile(p);
      setCompletion(60);
      navigate({ to: "/resume-upload" });
    } catch (error) {
      console.error("Unable to save onboarding data", error);
      toast.error(error instanceof Error ? error.message : "Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const allSkills = [...SKILLS, ...p.skills.filter((s) => !SKILLS.includes(s))];

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= step ? "text-primary" : ""}>{i + 1}. {s}</span>
            ))}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / 4) * 100}%` }} />
          </div>
        </div>
        <Card className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step {step + 1} of 4</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{STEPS[step]}</h1>
          <div className="mt-6 space-y-5">
            {step === 0 && (
              <>
                <div><Label>Full Name</Label><input className={inputCls} placeholder="Rahul Sharma" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><Label>Degree</Label>
                    <select className={inputCls} value={p.degree} onChange={(e) => setP({ ...p, degree: e.target.value })}>
                      <option value="">Select degree</option>
                      {["BCA", "B.Tech", "BSc", "Diploma", "MCA"].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div><Label>Graduation Year</Label>
                    <select className={inputCls} value={p.gradYear} onChange={(e) => setP({ ...p, gradYear: e.target.value })}>
                      <option value="">Select year</option>
                      {["2025", "2026", "2027", "2028"].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div><Label>Field of Study</Label><input className={inputCls} placeholder="Computer Science" value={p.field} onChange={(e) => setP({ ...p, field: e.target.value })} /></div>
              </>
            )}
            {step === 1 && (
              <>
                <p className="text-sm text-muted-foreground">Select all skills you're comfortable with.</p>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((s) => {
                    const on = p.skills.includes(s);
                    return (
                      <button key={s} type="button" onClick={() => toggle("skills", s)}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary"}`}>
                        {on ? "✓ " : ""}{s}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input className={inputCls} placeholder="+ Add Custom Skill" value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} />
                  <button type="button" onClick={addCustom} className={btnOutline}><Plus className="h-4 w-4" /> Add</button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div><Label>Areas of Interest</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {INTERESTS.map((i) => (
                      <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${p.interests.includes(i) ? "border-primary bg-secondary" : "border-border"}`}>
                        <input type="checkbox" className="h-4 w-4 accent-primary" checked={p.interests.includes(i)} onChange={() => toggle("interests", i)} />
                        {i}
                      </label>
                    ))}
                  </div>
                </div>
                <div><Label>Career Goal</Label><textarea rows={3} className={inputCls} placeholder="Become a full-stack developer at a product company" value={p.careerGoal} onChange={(e) => setP({ ...p, careerGoal: e.target.value })} /></div>
              </>
            )}
            {step === 3 && (
              <>
                <div><Label>Work Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {MODES.map(({ v, icon: Icon }) => (
                      <button key={v} type="button" onClick={() => setP({ ...p, workMode: v })}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${p.workMode === v ? "border-primary bg-secondary text-primary" : "border-border text-foreground hover:border-primary"}`}>
                        <Icon className="h-5 w-5" />{v}
                      </button>
                    ))}
                  </div>
                </div>
                <div><Label>City</Label><input className={inputCls} placeholder="Mumbai" value={p.city} onChange={(e) => setP({ ...p, city: e.target.value })} /></div>
              </>
            )}
          </div>
          <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <button type="button" className={btnOutline} onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1))}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 3 ? (
              <button type="button" className={btnPrimary} disabled={!canContinue} onClick={continueStep}>Continue <ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button type="button" className={btnPrimary} disabled={!canContinue || saving} onClick={finish}>
                {saving ? "Saving..." : "Complete Profile & Upload Resume"} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
