import type { WorkMode } from "../types/models";

interface FloatingWidgetProps {
  mode: WorkMode;
  modeMinutes: number;
  hydrationDisplay: string;
  nextEyeBreakMinutes: number;
}

const modeIcon: Record<WorkMode, string> = {
  sitting: "🪑",
  standing: "🧍",
  walking: "🚶",
};

export function FloatingWidget({ mode, modeMinutes, hydrationDisplay, nextEyeBreakMinutes }: FloatingWidgetProps) {
  return (
    <aside className="fixed bottom-4 right-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-lg backdrop-blur-sm">
      <span className="font-medium">{modeIcon[mode]} {modeMinutes}m</span>
      <span className="mx-2 text-slate-400">|</span>
      <span className="font-medium">💧 {hydrationDisplay}</span>
      <span className="mx-2 text-slate-400">|</span>
      <span className="font-medium">👁 {nextEyeBreakMinutes}m</span>
    </aside>
  );
}
