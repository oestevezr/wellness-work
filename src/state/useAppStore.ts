import { create } from "zustand";
import { hydrationTotal } from "../domain/hydration";
import { recommendRoutine } from "../domain/routineEngine";
import { createAppStorage } from "../persistence/storage";
import type { HydrationEntry, Reminder, Session, UserProfile, WorkMode } from "../types/models";

const DEFAULT_HYDRATION_GOAL_ML = 2000;

interface AppState {
  initialized: boolean;
  profile: UserProfile | null;
  currentMode: WorkMode;
  sessions: Session[];
  hydrationEntries: HydrationEntry[];
  reminders: Reminder[];
  initialize: () => Promise<void>;
  completeOnboarding: (profile: UserProfile) => void;
  switchMode: (mode: WorkMode) => void;
  addHydration: (amountML: number) => void;
  addReminder: (reminder: Reminder) => void;
  completeReminder: (timestamp: string) => void;
}

async function persistSnapshot(state: AppState): Promise<void> {
  const storage = await createAppStorage();
  await storage.save({
    profile: state.profile,
    currentMode: state.currentMode,
    sessions: state.sessions,
    hydrationEntries: state.hydrationEntries,
    reminders: state.reminders,
  });
}

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  profile: null,
  currentMode: "sitting",
  sessions: [],
  hydrationEntries: [],
  reminders: [],
  initialize: async () => {
    const storage = await createAppStorage();
    const persisted = await storage.load();

    if (persisted) {
      set({
        profile: persisted.profile,
        currentMode: persisted.currentMode,
        sessions: persisted.sessions,
        hydrationEntries: persisted.hydrationEntries,
        reminders: persisted.reminders,
        initialized: true,
      });
      return;
    }

    set({ initialized: true });
  },
  completeOnboarding: (profile) => {
    set({ profile });
    void persistSnapshot(get());
  },
  switchMode: (mode) => {
    const now = new Date().toISOString();
    const sessions = [...get().sessions];
    const active = sessions[sessions.length - 1];

    if (active && !active.endTime) {
      active.endTime = now;
    }

    sessions.push({
      startTime: now,
      workMode: mode,
    });

    set({ currentMode: mode, sessions });
    void persistSnapshot(get());
  },
  addHydration: (amountML) => {
    const hydrationEntries = [...get().hydrationEntries, { timestamp: new Date().toISOString(), amountML }];
    set({ hydrationEntries });
    void persistSnapshot(get());
  },
  addReminder: (reminder) => {
    const reminders = [...get().reminders, reminder];
    set({ reminders });
    void persistSnapshot(get());
  },
  completeReminder: (timestamp) => {
    const reminders = get().reminders.map((reminder) =>
      reminder.timestamp === timestamp ? { ...reminder, completed: true } : reminder,
    );
    set({ reminders });
    void persistSnapshot(get());
  },
}));

export function useHydrationProgress() {
  const profile = useAppStore((state) => state.profile);
  const entries = useAppStore((state) => state.hydrationEntries);

  const total = hydrationTotal(entries);
  const goal = profile?.hydrationGoal ?? DEFAULT_HYDRATION_GOAL_ML;

  return {
    total,
    goal,
    percentage: Math.min(100, Math.round((total / goal) * 100)),
  };
}

export function useCurrentRecommendation() {
  const profile = useAppStore((state) => state.profile);
  const mode = useAppStore((state) => state.currentMode);
  const sessions = useAppStore((state) => state.sessions);

  if (!profile) {
    return {
      nextReminderInMinutes: 20,
      suggestion: "Finish setup to personalize your routine.",
    };
  }

  const active = sessions[sessions.length - 1];
  const start = active?.startTime ? new Date(active.startTime).getTime() : Date.now();
  const minutesInCurrentMode = Math.max(0, Math.round((Date.now() - start) / 60000));

  return recommendRoutine({
    setupType: profile.setupType,
    frictionLevel: profile.frictionLevel,
    currentMode: mode,
    minutesInCurrentMode,
    hourOfDay: new Date().getHours(),
  });
}
