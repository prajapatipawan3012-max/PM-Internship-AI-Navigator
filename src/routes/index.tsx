import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Sparkles, Target, UserPlus } from "lucide-react";
import { AppHeader, btnOutline, btnPrimary, Card } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PM Internship AI Navigator — Find internships that match your skills" },
      { name: "description", content: "Let AI analyze your profile and discover internships that fit your skills, interests and career goals." },
      { property: "og:title", content: "PM Internship AI Navigator" },
      { property: "og:description", content: "AI-powered internship matching with clear match scores and skill-gap roadmaps." },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: UserPlus, title: "Create Profile", text: "Enter degree and skills" },
  { icon: FileText, title: "Upload Resume", text: "Let Gemini AI parse your experience" },
  { icon: Sparkles, title: "Smart Matching", text: "Pinecone vector search & hybrid scoring" },
  { icon: Target, title: "Bridge Skill Gaps", text: "Clear match scores and skill roadmap" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        right={
          <>
            <a href="#how" className="hidden text-muted-foreground hover:text-foreground sm:inline">How It Works</a>
            <Link to="/dashboard" className="hidden text-muted-foreground hover:text-foreground sm:inline">Explore</Link>
            <Link to="/onboarding" className={btnPrimary}>Sign In</Link>
          </>
        }
      />
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          <Sparkles className="h-3.5 w-3.5" /> AI-powered internship matching
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Find Internships That <span className="text-primary">Match Your Skills.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Let AI analyze your profile and discover internship opportunities that fit your skills, interests, and career goals.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/onboarding" className={btnPrimary}>Get Started <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/dashboard" className={btnOutline}>Explore Internships</Link>
        </div>
      </section>
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20">
        <h2 className="text-center text-2xl font-bold text-foreground">How It Works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Card key={s.title}>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-3xl font-extrabold text-secondary">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Demo prototype for IGNITE 1% Hackathon. Not an official government portal.
      </footer>
    </div>
  );
}
