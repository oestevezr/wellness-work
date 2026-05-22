import type { HydrationEntry, Reminder, Session, UserProfile, WorkMode } from "../types/models";

interface PersistedState {
  profile: UserProfile | null;
  currentMode: WorkMode;
  sessions: Session[];
  hydrationEntries: HydrationEntry[];
  reminders: Reminder[];
}

const STORAGE_KEY = "healthy-workspace-companion:mvp-state";

export interface AppStorage {
  load(): Promise<PersistedState | null>;
  save(state: PersistedState): Promise<void>;
}

class LocalJsonStorage implements AppStorage {
  async load(): Promise<PersistedState | null> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : null;
  }

  async save(state: PersistedState): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

class SqliteStorage implements AppStorage {
  private initialized = false;

  private async init() {
    if (this.initialized) {
      return;
    }

    const { default: Database } = await import("@tauri-apps/plugin-sql");
    const db = await Database.load("sqlite:wellness-work.db");
    await db.execute(
      "CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK (id = 1), payload TEXT NOT NULL)",
    );
    this.initialized = true;
  }

  async load(): Promise<PersistedState | null> {
    await this.init();

    const { default: Database } = await import("@tauri-apps/plugin-sql");
    const db = await Database.load("sqlite:wellness-work.db");
    const rows = await db.select<{ payload: string }[]>("SELECT payload FROM app_state WHERE id = 1");
    const payload = rows[0]?.payload;
    return payload ? (JSON.parse(payload) as PersistedState) : null;
  }

  async save(state: PersistedState): Promise<void> {
    await this.init();

    const { default: Database } = await import("@tauri-apps/plugin-sql");
    const db = await Database.load("sqlite:wellness-work.db");
    await db.execute("INSERT OR REPLACE INTO app_state (id, payload) VALUES (1, ?1)", [JSON.stringify(state)]);
  }
}

export async function createAppStorage(): Promise<AppStorage> {
  const globals = globalThis as { __TAURI_INTERNALS__?: unknown };
  if (globals.__TAURI_INTERNALS__) {
    return new SqliteStorage();
  }
  return new LocalJsonStorage();
}
