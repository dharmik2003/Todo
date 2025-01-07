"use server";
import { createClient } from "@/utils/supabase/server";

export type TodoType = {
  title: string;
  description: string;
  user_id: string;
};

export type TodoUpdateType = {
  id: string;
  title: string;
  description: string;
  user_id: string;
};

export const addTodos = async ({ title, description, user_id }: TodoType) => {
  const supabase = await createClient();

  try {
    const newTodo = {
      title,
      description,
      user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("Todos")
      .insert(newTodo)
      .select()
      .single();

    if (error) {
      return {
        message: error.message,
      };
    }

    return { message: "Todo added successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to add todo",
    };
  }
};

export const fetchTodos = async (user_id: string) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("Todos")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

export const deleteTodo = async (todoId: string) => {
  const supabase = await createClient();

  try {
  
    const { data, error } = await supabase
      .from("Todos")
      .delete()
      .eq("id", todoId);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Todo deleted successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete todo",
    };
  }
};

export const updateTodo = async ({
  id,
  title,
  description,
  user_id,
}: TodoUpdateType) => {
  const supabase = await createClient();

  try {
    const updatedTodo = {
      title,
      description,
      user_id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("Todos")
      .update(updatedTodo)
      .eq("id", id);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Todo updated successfully!",
      data,
    };
  } catch (error: any) {
    console.error("Error updating todo:", error);
    return {
      success: false,
      message: error?.message || "Failed to update todo",
    };
  }
};
