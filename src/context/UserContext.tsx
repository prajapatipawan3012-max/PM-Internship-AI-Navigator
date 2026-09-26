import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Profile = {
  name: string;
  degree: string;
  field: string;
  gradYear: string;
  skills: string[];
  interests: string[];
  careerGoal: string;
  workMode: string;
  city: string;
};

type Ctx = {
  profile: Profile;
  setProfile: (p: Profile) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  completion: number;
  setCompletion: (n: number) => void;
};

const defaultProfile: Profile = {
  name: "Rahul Sharma",
  degree: "BCA",
  field: "",
  gradYear: "2026",
  skills: [],
  interests: [],
  careerGoal: "",
  workMode: "",
  city: "",
};

const KEY = "pm-navigator-user";
const UserContext = createContext<Ctx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [saved, setSaved] = useState<string[]>([]);
  const [completion, setCompletion] = useState(20);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.profile) setProfile({ ...defaultProfile, ...d.profile });
        if (Array.isArray(d.saved)) setSaved(d.saved);
        if (typeof d.completion === "number") setCompletion(d.completion);
      }
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem(KEY, JSON.stringify({ profile, saved, completion }));
  }, [profile, saved, completion]);

  const toggleSaved = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <UserContext.Provider value={{ profile, setProfile, saved, toggleSaved, completion, setCompletion }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const c = useContext(UserContext);
  if (!c) throw new Error("useUser must be used within UserProvider");
  return c;
}
