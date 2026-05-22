import { useMemo, useState } from "react";
import { defaultHydrationGoalFromWeight } from "../../domain/hydration";
import type { FrictionLevel, SetupType, UserProfile } from "../../types/models";

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const setupOptions: Record<SetupType, string> = {
  standard_desk: "Standard Desk",
  standing_desk: "Standing Desk",
  standing_desk_treadmill: "Standing Desk + Treadmill",
  custom_hybrid: "Custom Hybrid Setup",
};

const frictionOptions: Record<FrictionLevel, string> = {
  instant: "Instant",
  under_1_minute: "Less than 1 minute",
  requires_effort: "Requires setup effort",
};

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [setupType, setSetupType] = useState<SetupType>("standard_desk");
  const [frictionLevel, setFrictionLevel] = useState<FrictionLevel>("under_1_minute");
  const [workSchedule, setWorkSchedule] = useState("09:00-17:00");
  const [weightKg, setWeightKg] = useState(70);

  const recommendedGoal = useMemo(() => defaultHydrationGoalFromWeight(weightKg), [weightKg]);
  const [hydrationGoal, setHydrationGoal] = useState(recommendedGoal);

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Healthy Workspace Companion</h1>
      <p className="mt-2 text-sm text-slate-600">Set up your workspace once. The app adapts your routine with calm reminders.</p>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Workspace setup</span>
          <select
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={setupType}
            onChange={(event) => setSetupType(event.target.value as SetupType)}
          >
            {Object.entries(setupOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">How easy is it to switch work modes?</span>
          <select
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={frictionLevel}
            onChange={(event) => setFrictionLevel(event.target.value as FrictionLevel)}
          >
            {Object.entries(frictionOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Work schedule</span>
          <input
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={workSchedule}
            onChange={(event) => setWorkSchedule(event.target.value)}
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Body weight (kg)</span>
          <input
            type="number"
            min={35}
            max={200}
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={weightKg}
            onChange={(event) => {
              const nextWeight = Number(event.target.value);
              setWeightKg(nextWeight);
              setHydrationGoal(defaultHydrationGoalFromWeight(nextWeight));
            }}
          />
          <span className="text-xs text-slate-500">Default hydration formula: 35mL × kg = {recommendedGoal}mL</span>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Daily hydration goal (mL)</span>
          <input
            type="number"
            min={1000}
            className="rounded-xl border border-slate-300 px-3 py-2"
            value={hydrationGoal}
            onChange={(event) => setHydrationGoal(Number(event.target.value))}
          />
        </label>
      </div>

      <button
        className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        onClick={() =>
          onComplete({
            id: crypto.randomUUID(),
            setupType,
            frictionLevel,
            hydrationGoal,
            workSchedule,
            notificationStyle: "soft",
          })
        }
      >
        Start with this setup
      </button>
    </section>
  );
}
