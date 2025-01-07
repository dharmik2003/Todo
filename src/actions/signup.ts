"use server";
import { createClient } from "@/utils/supabase/server";

export type SignupType = {
  name: string;
  email: string;
  password: string;
};

export const signup = async ({ name, email, password }: SignupType) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "An unknown error occurred.",
      };
    }

    const user = data.user;

    const { error: insertError } = await supabase.from("Users").insert([
      {
        user_id: user?.id,
        email: email,
        name: name || "",
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("Error inserting user into custom table:", insertError);
      return {
        success: false,
        message: "User signup successful, but failed to store user data.",
      };
    }

    return {
      success: true,
      message:
        "Signup successful! Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Unexpected Signup Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};
