import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Heart, IndianRupee, Info, MapPin, Monitor } from "lucide-react";
import { AppHeader, btnOutline, btnPrimary, Card, MatchRing, Pill, SkillChip } from "@/components/ui-bits";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/context/UserContext";
import { internships } from "@/data/internships";
import { useUser as useClerkUser } from "@clerk/tanstack-react-start";
import { getSavedInternships, getStudentProfile, toggleSaveInternship } from "@/lib/supabaseDb";
import { useEffect, useState } from "react";

function rankInternships(profile: ReturnType<typeof useUser>["profile"]) {
  const interests = profile.interests.map((item) => item.toLowerCase());
  const skills = profile.skills.map((item) => item.toLowerCase());
  const profileText = [profile.field, profile.careerGoal, profile.degree, profile.city, profile.workMode, ...interests, ...skills]
    .join(" ")
    .toLowerCase();

  return internships
    .map((internship) => {
      const jobText = [internship.title, internship.company, internship.sector, internship.location, internship.mode, ...internship.matched, ...internship.gaps.map((gap) => gap.skill)]
        .join(" ")
        .toLowerCase();
      let score = internship.match;
      score += skills.filter((skill) => jobText.includes(skill)).length * 8;
      score += interests.filter((interest) => jobText.includes(interest)).length * 12;
      if (profile.city && internship.location.toLowerCase() === profile.city.toLowerCase()) score += 8;
      if (profile.workMode && internship.mode.toLowerCase() === profile.workMode.toLowerCase()) score += 5;
      if (profileText.includes("data science") && /data|analytics|machine learning/.test(jobText)) score += 25;
      if (profileText.includes("ai/ml") && /artificial intelligence|machine learning|ai/.test(jobText)) score += 25;
      if (profileText.includes("software development") && /software|frontend|development/.test(jobText)) score += 20;
      return { internship, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ internship }) => internship);
}

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your matches — PM Internship AI Navigator" },
      { name: "description", content: "Recommended internships ranked by AI match score with matched skills and skill gaps." },
      { property: "og:title", content: "Recommended internships for you" },
      { property: "og:description", content: "See match scores, matched skills and skill gaps for each internship." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, completion, saved, toggleSaved } = useUser();
  const { user } = useClerkUser();
  const [profileId, setProfileId] = useState<string | null>(null);
  useEffect(() => {
    if (!user) return;
    void getStudentProfile(user.id).then(async (studentProfile) => {
      if (!studentProfile?.id) return;
      setProfileId(studentProfile.id);
      const savedRows = await getSavedInternships(studentProfile.id);
      if (savedRows) savedRows.forEach((row) => {
        const internshipId = String(row.internship_id);
        if (!saved.includes(internshipId)) toggleSaved(internshipId);
      });
    }).catch((error) => console.error("Unable to load saved internships", error));
  }, [user]);
  const handleToggleSaved = (internshipId: string) => {
    toggleSaved(internshipId);
    if (profileId) void toggleSaveInternship(profileId, internshipId).catch((error) => console.error("Unable to save internship", error));
  };
  const savedList = internships.filter((i) => saved.includes(i.id));
  const recommendedInternships = rankInternships(profile);
  const name = profile?.name?.trim() ? profile.name.split(" ")[0] : "Rahul";
  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader
        right={
          <>
            <Sheet>
              <SheetTrigger className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
                <Heart className="h-4 w-4" /> Saved ({saved.length})
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Saved Internships</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-3">
                  {savedList.length === 0 && <p className="text-sm text-muted-foreground">No saved internships yet. Tap Save on any card.</p>}
                  {savedList.map((it) => (
                    <div key={it.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{it.title}</p>
                          <p className="text-sm text-muted-foreground">{it.company} · {it.location}</p>
                        </div>
                        <MatchRing value={it.match} size={52} />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link to="/internships/$id" params={{ id: "1" }} className={`${btnPrimary} flex-1 py-2`}>View Details</Link>
                        <button type="button" onClick={() => handleToggleSaved(it.id)} className={`${btnOutline} py-2`}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/onboarding" className="font-medium text-primary">Edit profile</Link>
          </>
        }
      />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {name}!</h1>
            <p className="text-sm text-muted-foreground">Here are internships picked for your profile.</p>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profile Completion</span>
              <span className="font-semibold text-primary">{completion}% Complete</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </Card>

        <div className="flex gap-3 rounded-xl border border-primary/30 bg-secondary p-4 text-sm text-secondary-foreground">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p><strong>Disclaimer:</strong> AI Match Score is a recommendation indicator, not an official selection probability or guarantee of eligibility.</p>
        </div>

        <h2 className="text-lg font-bold text-foreground">Recommended Internships</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {recommendedInternships.map((it) => {
            const isSaved = saved.includes(it.id);
            return (
              <Card key={it.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-foreground">{it.title}</h3>
                    <p className="text-sm text-muted-foreground">{it.company}</p>
                  </div>
                  <MatchRing value={it.match} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill><MapPin className="h-3 w-3" />{it.location}</Pill>
                  <Pill><Monitor className="h-3 w-3" />{it.mode}</Pill>
                  <Pill><Clock className="h-3 w-3" />{it.duration}</Pill>
                  <Pill><IndianRupee className="h-3 w-3" />{it.stipend.replace("₹", "")}</Pill>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Matched Skills</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">{it.matched.map((s) => <SkillChip key={s} skill={s} kind="match" />)}</div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skill Gaps</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">{it.gaps.map((g) => <SkillChip key={g.skill} skill={g.skill} kind="gap" />)}</div>
                <div className="mt-4 rounded-lg bg-muted p-3">
                  <p className="text-xs font-semibold text-foreground">Why This Matches You</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                    {it.why.map((w) => <li key={w}>{w}</li>)}
                  </ul>
                </div>
                <div className="mt-auto flex gap-2 pt-5">
                  <Link to="/internships/$id" params={{ id: "1" }} className={`${btnPrimary} flex-1`}>View Details</Link>
                  <button type="button" onClick={() => handleToggleSaved(it.id)} className={`${btnOutline} ${isSaved ? "border-primary text-primary" : ""}`} aria-pressed={isSaved}>
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-primary" : ""}`} />{isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
