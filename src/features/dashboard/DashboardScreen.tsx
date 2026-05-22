import { QUICK_ADD_CUP_SIZES } from "../../domain/hydration";
import { useCurrentRecommendation, useHydrationProgress } from "../../state/useAppStore";
import type { WorkMode } from "../../types/models";

interface DashboardScreenProps {
  currentMode: WorkMode;
  onModeSwitch: (mode: WorkMode) => void;
  onQuickHydration: (amountML: number) => void;
}

const modes: WorkMode[] = ["sitting", "standing", "walking"];

export function DashboardScreen({ currentMode, onModeSwitch, onQuickHydration }: DashboardScreenProps) {
  const hydration = useHydrationProgress();
  const recommendation = useCurrentRecommendation();

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Daily Summary</h2>
        <p className="mt-1 text-sm text-slate-600">{recommendation.suggestion}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Work mode</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {modes.map((mode) => (
              <button
                key={mode}
                onClick={() => onModeSwitch(mode)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  mode === currentMode ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Hydration</h3>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {hydration.total} / {hydration.goal} mL
          </p>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${hydration.percentage}%` }} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_ADD_CUP_SIZES.map((size) => (
              <button
                key={size}
                className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-900 hover:bg-cyan-100"
                onClick={() => onQuickHydration(size)}
              >
                +{size}mL
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Reminders</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>• Next eye-care reminder in {recommendation.nextReminderInMinutes} min</li>
            <li>• Soft posture prompts only</li>
            <li>• Walking mode reduces interruption frequency</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
