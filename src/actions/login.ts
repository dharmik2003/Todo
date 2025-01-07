"use server";

import { createClient } from "@/utils/supabase/server";

export type LoginType = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginType) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error.message.includes("email not confirmed")) {
        return {
          success: false,
          message: "Email is not verified. Please verify your email.",
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data.user?.email_confirmed_at) {
      return {
        success: false,
        message: "Email is not verified. Please verify your email.",
      };
    }

    return { success: true, message: "Login successful!", data };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = async () => {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Successfully logged out.",
    };
  } catch (error) {
    console.error("Logout Error:", error);
    return {
      success: false,
      message: "An error occurred while logging out.",
    };
  }
};
