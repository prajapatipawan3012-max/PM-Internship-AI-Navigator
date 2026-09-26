# PM Internship AI Navigator — 5-page prototype

A student-facing internship matching demo with mock data (no backend needed). Indigo/blue brand (#4F46E5), white background, soft rounded cards, green "matched skill" chips and amber "skill gap" chips.

## Pages

1. **Landing (`/`)** — top bar with logo and links ("How It Works", "Explore", "Sign In"), hero with the headline "Find Internships That Match Your Skills." plus "Get Started" and "Explore Internships" buttons, a 4-step how-it-works grid (Create Profile, Upload Resume, Smart Matching, Bridge Skill Gaps), and the hackathon demo footer notice.
2. **Onboarding (`/onboarding`)** — 4-step wizard with a progress bar: education details, clickable skill chips with a custom-skill input, interest checkboxes plus career goal, then work mode radio cards and city. Back/Continue, final button goes to resume upload.
3. **Resume Upload (`/resume-upload`)** — drag-and-drop PDF area, animated analysis progress ("Gemini AI is analyzing your profile... 80%"), summary card with mock extracted skills and project highlights, buttons to continue or skip to the dashboard.
4. **Dashboard (`/dashboard`)** — greeting, profile completion bar, the match-score disclaimer box, and a grid of internship cards showing role, company, location/mode/duration/stipend badges, a circular match percentage, matched skills, skill gaps, two "why this matches you" bullets, View Details and a toggleable Save button.
5. **Internship Details (`/internships/1`)** — full role information, official eligibility, the transparent match-score breakdown table (skills 30, education 20, career goal 20, interests 15, location 10, experience 5), side-by-side "Skills You Have" vs "Skills to Improve" with learning tips, an external apply link, and the demo-dataset footer notice.

## Behaviour and data

- At least 6 varied tech internships as realistic mock data in one shared file, so dashboard cards and every details page (`/internships/1` to `/internships/6`) stay consistent.
- A shared student profile keeps the wizard answers, saved internships and profile completion (20% at start, rising to 85% after onboarding and resume upload). The dashboard greets the student by name; nothing is stored permanently.
- Skill tips on the details page, e.g. "Learn Git basics on YouTube".
- Fully responsive: single column on phones, multi-column grids on desktop.

## Technical notes

- Routes as TanStack Router files: `index`, `onboarding`, `resume-upload`, `dashboard`, `internships.$id` (id `1` seeded; other ids fall back to the first record).
- Brand palette, chip colours and radii added as semantic tokens in `src/styles.css`; no hardcoded colour utilities in components.
- Shared UI pieces (skill chip, match ring, internship card, section shell) as small components under `src/components/`.
- Lucide React icons; shadcn primitives where they already exist.
- Per-page `head()` metadata with unique titles and descriptions.
- Wizard/saved state via a lightweight React context so it survives navigation between pages.
