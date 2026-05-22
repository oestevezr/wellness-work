import { useEffect } from "react";
import { FloatingWidget } from "./components/FloatingWidget";
import { DashboardScreen } from "./features/dashboard/DashboardScreen";
import { OnboardingScreen } from "./features/onboarding/OnboardingScreen";
import { useAppStore, useCurrentRecommendation, useHydrationProgress } from "./state/useAppStore";

function App() {
  const initialized = useAppStore((state) => state.initialized);
  const profile = useAppStore((state) => state.profile);
  const currentMode = useAppStore((state) => state.currentMode);
  const sessions = useAppStore((state) => state.sessions);
  const initialize = useAppStore((state) => state.initialize);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const switchMode = useAppStore((state) => state.switchMode);
  const addHydration = useAppStore((state) => state.addHydration);
  const recommendation = useCurrentRecommendation();
  const hydration = useHydrationProgress();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!initialized) {
    return <main className="grid min-h-screen place-items-center bg-slate-50">Loading…</main>;
  }

  const activeSession = sessions[sessions.length - 1];
  const modeMinutes = activeSession?.startTime
    ? Math.max(0, Math.round((Date.now() - new Date(activeSession.startTime).getTime()) / 60000))
    : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      {profile ? (
        <DashboardScreen currentMode={currentMode} onModeSwitch={switchMode} onQuickHydration={addHydration} />
      ) : (
        <OnboardingScreen onComplete={completeOnboarding} />
      )}

      {profile && (
        <FloatingWidget
          mode={currentMode}
          modeMinutes={modeMinutes}
          hydrationDisplay={`${Math.round(hydration.total / 250)}/${Math.max(1, Math.round(hydration.goal / 250))}`}
          nextEyeBreakMinutes={recommendation.nextReminderInMinutes}
        />
      )}
    </main>
  );
}

export default App;
