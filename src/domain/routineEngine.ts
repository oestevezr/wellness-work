import type { FrictionLevel, SetupType, WorkMode } from "../types/models";

export interface RoutineInput {
  setupType: SetupType;
  frictionLevel: FrictionLevel;
  currentMode: WorkMode;
  minutesInCurrentMode: number;
  hourOfDay: number;
}

export interface RoutineRecommendation {
  nextReminderInMinutes: number;
  suggestion: string;
}

export function recommendRoutine(input: RoutineInput): RoutineRecommendation {
  if (
    input.setupType === "standing_desk_treadmill" &&
    input.frictionLevel === "requires_effort" &&
    input.currentMode !== "walking" &&
    input.minutesInCurrentMode >= 110
  ) {
    return {
      nextReminderInMinutes: 10,
      suggestion: "Plan a longer 45-minute walking session instead of frequent switches.",
    };
  }

  if (input.currentMode === "walking") {
    return {
      nextReminderInMinutes: 30,
      suggestion: "Keep interruptions low while walking; hydrate on the next check-in.",
    };
  }

  if (input.currentMode === "standing") {
    return {
      nextReminderInMinutes: 20,
      suggestion: "Rotate posture and do a quick shoulder mobility reset.",
    };
  }

  const afternoonFatigueWindow = input.hourOfDay >= 14 && input.hourOfDay <= 17;
  return {
    nextReminderInMinutes: afternoonFatigueWindow ? 15 : 20,
    suggestion: "Follow a soft 20-20-20 eye break and a gentle posture check.",
  };
}
