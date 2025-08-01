import { supabase } from "../lib/supabaseClient";
import type { FilterValues } from "../types/filterTypes";

export const getAllStudents = async ({
  queryKey,
}: {
  queryKey: [string, FilterValues, string];
}) => {
  const [, filters, search] = queryKey;

  // All
  let query = supabase.from("students").select("*");

  // course
  if (filters.course) {
    query = query.contains("course_enrolled", [filters.course]);
  }

  // region
  if (filters.region) {
    query = query.eq("region", filters.region);
  }

  // Search
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // date
  if (filters.dateRange && filters.dateRange.length === 2) {
    const [from, to] = filters.dateRange;
    query = query
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString());
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};
