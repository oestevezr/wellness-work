export type SetupType =
  | "standard_desk"
  | "standing_desk"
  | "standing_desk_treadmill"
  | "custom_hybrid";

export type FrictionLevel = "instant" | "under_1_minute" | "requires_effort";

export type WorkMode = "sitting" | "standing" | "walking";

export type ReminderType = "blink" | "distance_focus" | "eye_mobility" | "posture";

export interface UserProfile {
  id: string;
  setupType: SetupType;
  frictionLevel: FrictionLevel;
  hydrationGoal: number;
  workSchedule: string;
  notificationStyle: "soft" | "minimal";
}

export interface Session {
  startTime: string;
  endTime?: string;
  workMode: WorkMode;
}

export interface HydrationEntry {
  timestamp: string;
  amountML: number;
}

export interface Reminder {
  type: ReminderType;
  timestamp: string;
  completed: boolean;
}
