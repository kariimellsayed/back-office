import { supabase } from "../lib/supabaseClient";
import type { Student } from "../types/studentType";

export const AddStudent = async ({ body }: { body: Student }) => {
  const { data, error } = await supabase
    .from("students")
    .insert([body])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
