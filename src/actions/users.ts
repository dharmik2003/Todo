"use server";
import { createClient } from "@/utils/supabase/server";

export const fetchUserData = async (user_id: string) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "User data fetched successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      success: false,
      message: "Failed to fetch user data",
    };
  }
};
export async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching authenticated user:", error.message);
    return null;
  }

  return user || null;
}

export const getUserIdFromAuth = async () => {
  const supabase = await createClient();

  const user = await getAuthenticatedUser();
  if (!user) {
    console.error("Error fetching user data....");
    return null;
  }
  const authId = user!.id;
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", authId)
    .maybeSingle();

  if (userError || !userData) {
    console.error("Error fetching user data", userError);
    return null;
  }

  return userData?.id;
};
