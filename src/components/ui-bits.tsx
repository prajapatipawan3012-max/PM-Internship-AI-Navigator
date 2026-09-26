import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import { Show, SignInButton, SignUpButton, SignOutButton, UserButton } from "@clerk/tanstack-react-start";

export function SkillChip({ skill, kind }: { skill: string; kind: "match" | "gap" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        kind === "match" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
      }`}
    >
      {kind === "match" ? "✓" : "✗"} {skill}
    </span>
  );
}

export function MatchRing({ value, size = 64 }: { value: number; size?: number }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} className="stroke-secondary" strokeWidth={5} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="stroke-primary"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-sm font-bold text-foreground">{value}%</span>
        <span className="mt-0.5 text-[9px] font-semibold tracking-wide text-muted-foreground">MATCH</span>
      </div>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
      <img src="/logo.png" alt="PM Internship AI Navigator logo" className="h-9 w-9 rounded-lg object-contain" />
      <span className="text-sm sm:text-base">PM Internship AI Navigator</span>
    </Link>
  );
}

export function AppHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-3 text-sm">
          {right}
          <div className="flex items-center gap-2 pl-2 border-l border-border/70">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:bg-accent cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <SignOutButton>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground cursor-pointer"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`}>{children}</div>;
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent";
export const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
