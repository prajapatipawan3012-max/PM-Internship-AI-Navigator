import { createContext, useContext, useState, type ReactNode } from "react";

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
  name: "",
  degree: "",
  field: "",
  gradYear: "",
  skills: [],
  interests: [],
  careerGoal: "",
  workMode: "",
  city: "",
};

const UserContext = createContext<Ctx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [saved, setSaved] = useState<string[]>([]);
  const [completion, setCompletion] = useState(20);
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
