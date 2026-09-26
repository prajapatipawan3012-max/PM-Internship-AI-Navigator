import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Sparkles, Target, UserPlus } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/tanstack-react-start";
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
  { icon: UserPlus, title: "Create Profile", text: "Enter your degree, skills, and preferences" },
  { icon: FileText, title: "Upload Resume", text: "AI automatically parses your experience and achievements" },
  { icon: Sparkles, title: "Smart Matching", text: "Intelligent skill matching & compatibility scoring" },
  { icon: Target, title: "Bridge Skill Gaps", text: "Personalized match insights and tailored career roadmaps" },
];

function Landing() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        right={
          <>
            <a href="#how" className="hidden text-muted-foreground hover:text-foreground sm:inline transition-colors">How It Works</a>
            <Link to="/dashboard" className="hidden text-muted-foreground hover:text-foreground sm:inline transition-colors">Explore</Link>
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
          {isSignedIn ? (
            <Link to="/onboarding" className={btnPrimary}>Get Started <ArrowRight className="h-4 w-4" /></Link>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl="/onboarding">
              <button type="button" className={btnPrimary}>Get Started <ArrowRight className="h-4 w-4" /></button>
            </SignInButton>
          )}
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
      <footer className="border-t border-border bg-card/40 py-8 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p>© {new Date().getFullYear()} PM Internship AI Navigator. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Explore Internships</Link>
            <Link to="/onboarding" className="hover:text-foreground transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
