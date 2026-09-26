import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, Clock, ExternalLink, GraduationCap, IndianRupee, Lightbulb, MapPin, Monitor } from "lucide-react";
import { AppHeader, btnOutline, btnPrimary, Card, MatchRing, Pill, SkillChip } from "@/components/ui-bits";
import { getInternship } from "@/data/internships";

export const Route = createFileRoute("/internships/$id")({
  loader: ({ params }) => {
    const it = getInternship(params.id);
    if (!it) throw notFound();
    return it;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Internship not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.title} at ${loaderData.company} — PM Internship AI Navigator`;
    const d = `${loaderData.mode} internship in ${loaderData.location}, ${loaderData.duration}, ${loaderData.stipend}. See your match breakdown.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: InternshipNotFound,
  component: Details,
});

function InternshipNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">Internship not found</h1>
      <Link to="/dashboard" className={btnPrimary}>Back to dashboard</Link>
    </div>
  );
}

function Details() {
  const it = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader right={<Link to="/dashboard" className="flex items-center gap-1 font-medium text-primary"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>} />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <Card className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{it.sector}</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{it.title}</h1>
            <p className="text-muted-foreground">{it.company}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill><MapPin className="h-3 w-3" />{it.location}</Pill>
              <Pill><Monitor className="h-3 w-3" />{it.mode}</Pill>
              <Pill><Clock className="h-3 w-3" />{it.duration}</Pill>
              <Pill><IndianRupee className="h-3 w-3" />{it.stipend.replace("₹", "")}</Pill>
            </div>
          </div>
          <MatchRing value={it.match} size={96} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="flex items-center gap-2 font-bold text-foreground"><GraduationCap className="h-5 w-5 text-primary" /> Official Eligibility</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[["Required Degree", it.eligibility.degree], ["Batch", it.eligibility.batch], ["Other Criteria", it.eligibility.other]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border pb-2 last:border-0">
                  <dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <h2 className="flex items-center gap-2 font-bold text-foreground"><Briefcase className="h-5 w-5 text-primary" /> Match Score Breakdown</h2>
            <table className="mt-4 w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-medium">Factor</th><th className="pb-2 font-medium">Weight</th><th className="pb-2 text-right font-medium">Your Score</th></tr></thead>
              <tbody>
                {it.breakdown.map((b) => (
                  <tr key={b.label} className="border-t border-border">
                    <td className="py-2 text-foreground">{b.label}</td>
                    <td className="py-2 text-muted-foreground">{b.weight}%</td>
                    <td className="py-2 text-right font-semibold text-foreground">{b.score} / {b.weight}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border"><td className="py-2 font-bold text-foreground">Total</td><td className="py-2 text-muted-foreground">100%</td><td className="py-2 text-right font-bold text-primary">{it.breakdown.reduce((a, b) => a + b.score, 0)}%</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="font-bold text-foreground">Skills You Have</h2>
            <div className="mt-4 flex flex-wrap gap-2">{it.matched.map((s) => <SkillChip key={s} skill={s} kind="match" />)}</div>
          </Card>
          <Card>
            <h2 className="font-bold text-foreground">Skills to Improve</h2>
            <ul className="mt-4 space-y-3">
              {it.gaps.map((g) => (
                <li key={g.skill} className="flex flex-col gap-1.5">
                  <SkillChip skill={g.skill} kind="gap" />
                  <span className="flex items-start gap-1.5 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />{g.tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={it.url} target="_blank" rel="noopener noreferrer" className={btnPrimary}>Apply / View Official Source <ExternalLink className="h-4 w-4" /></a>
          <Link to="/dashboard" className={btnOutline}>Back to matches</Link>
        </div>
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Demo internship dataset – for prototype demonstration only.
      </footer>
    </div>
  );
}
