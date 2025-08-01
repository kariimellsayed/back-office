import { supabase } from "../lib/supabaseClient";
import type { Student } from "../types/studentType";

interface EditStudentProps {
  id: string | undefined;
  dataEdit: Student;
}

export const editStudent = async ({ id, dataEdit }: EditStudentProps) => {
  const { error } = await supabase
    .from("students")
    .update(dataEdit)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
