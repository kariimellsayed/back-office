import dayjs from "dayjs";

export interface FilterValues {
  course?: string | null;
  region?: string | null;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
}
