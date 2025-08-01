import { supabase } from "../lib/supabaseClient";

export const deleteStudents = async (ids: string[]) => {
  const { error } = await supabase.from("students").delete().in("id", ids);

  if (error) {
    throw new Error(error.message);
  }
};
