import { colors } from "../constants/colors";
import type { WorkRecord } from "../api/employer/types";

export type WorkStatus = "scheduled" | "working" | "completed";

export const getWorkStatus = (record: WorkRecord): WorkStatus => {
  const now = new Date();
  const [startH, startM] = record.startTime.split(":").map(Number);
  const [endH, endM] = record.endTime.split(":").map(Number);

  const start = new Date(`${record.workDate}T00:00:00`);
  start.setHours(startH ?? 0, startM ?? 0, 0, 0);

  const end = new Date(`${record.workDate}T00:00:00`);
  end.setHours(endH ?? 0, endM ?? 0, 0, 0);

  if (now < start) return "scheduled";
  if (now <= end) return "working";
  return "completed";
};

export const WORK_STATUS_COLOR: Record<WorkStatus, string> = {
  scheduled: colors.green,
  working: colors.primary,
  completed: colors.grey,
};
