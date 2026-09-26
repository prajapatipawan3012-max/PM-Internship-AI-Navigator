import { supabase } from "./supabaseClient";

export interface ProfileInput {
  user_id: string;
  full_name: string;
  degree: string;
  field_of_study: string;
  graduation_year: string;
  interests: string[];
  career_goal: string;
  work_mode?: string;
  workMode?: string;
  city: string;
}

export type StudentProfileData = ProfileInput;

async function unwrap<T>(request: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await request;
  if (error) throw new Error(error.message);
  return data;
}

export async function saveStudentProfile(profileData: StudentProfileData) {
  const { workMode: _workMode, ...profileFields } = profileData;
  return unwrap(
    supabase
      .from("profiles")
      .upsert(
        { ...profileFields, work_mode: profileData.work_mode || profileData.workMode || "Remote" },
        { onConflict: "user_id" },
      )
      .select()
      .single(),
  );
}

export async function saveStudentSkills(profileId: string, skillNames: string[], source: string) {
  if (skillNames.length === 0) return [];

  return unwrap(
    supabase
      .from("skills")
      .insert(skillNames.map((skillName) => ({ profile_id: profileId, skill_name: skillName, source })))
      .select(),
  );
}

export async function getStudentProfile(userId: string) {
  const profile = await unwrap<{ id: string }>(
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
  );
  if (!profile) return null;

  const skills = await unwrap(supabase.from("skills").select("*").eq("profile_id", profile.id));
  return { ...profile, skills: skills ?? [] };
}

export async function uploadResumePDF(profileId: string, userId: string, file: File) {
  if (file.type !== "application/pdf") throw new Error("Only PDF resumes can be uploaded.");

  const filePath = `${userId}/${profileId}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage.from("resumes").getPublicUrl(filePath);
  return unwrap(
    supabase
      .from("resumes")
      .insert({
        profile_id: profileId,
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        file_url: publicUrl.publicUrl,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single(),
  );
}

export async function saveAIAnalysis(profileId: string, resumeId: string, extractedData: unknown) {
  return unwrap(
    supabase.from("ai_analysis").insert({ profile_id: profileId, resume_id: resumeId, extracted_data: extractedData }).select().single(),
  );
}

export async function getInternships(limit = 20) {
  return unwrap(supabase.from("internships").select("*").limit(limit));
}

export async function getInternshipById(id: string) {
  return unwrap(supabase.from("internships").select("*").eq("id", id).single());
}

export async function toggleSaveInternship(profileId: string, internshipId: string) {
  const existing = await unwrap(
    supabase
      .from("saved_internships")
      .select("profile_id, internship_id")
      .eq("profile_id", profileId)
      .eq("internship_id", internshipId)
      .maybeSingle(),
  );

  if (existing) {
    await unwrap(
      supabase.from("saved_internships").delete().eq("profile_id", profileId).eq("internship_id", internshipId),
    );
    return false;
  }

  await unwrap(supabase.from("saved_internships").insert({ profile_id: profileId, internship_id: internshipId }));
  return true;
}

export async function getSavedInternships(profileId: string) {
  return unwrap(
    supabase
      .from("saved_internships")
      .select("*, internships(*)")
      .eq("profile_id", profileId),
  );
}

export async function updateProfileCompletion(profileId: string, profileCompletion: number) {
  return unwrap(
    supabase
      .from("profiles")
      .update({ profile_completion: profileCompletion })
      .eq("id", profileId)
      .select()
      .single(),
  );
}