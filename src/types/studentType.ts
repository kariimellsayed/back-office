export interface Student {
  id?: string;
  name: string;
  region: string;
  course_enrolled: string[];
  email: string;
  invite_code?: string | null;
  avatar?: string | null;
  phone_num: string;
}
