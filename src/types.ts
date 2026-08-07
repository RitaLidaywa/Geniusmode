export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // ISO date (yyyy-mm-dd)
  mood: MoodValue;
  note?: string;
  createdAt: string; // ISO timestamp
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date
  prompt: string;
  text: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface StreakResetEvent {
  id: string;
  date: string; // ISO timestamp of the reset
  daysBeforeReset: number;
}

export interface StreakData {
  startDate: string; // ISO timestamp
  resets: StreakResetEvent[];
  longestStreakDays: number;
}

export interface ReframeEntry {
  id: string;
  date: string; // ISO timestamp
  situation: string;
  automaticThought: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
}

export interface UnsentLetter {
  id: string;
  date: string; // ISO timestamp
  title: string;
  text: string;
}

export interface AppSettings {
  appLockEnabled: boolean;
  hasCompletedOnboarding: boolean;
  displayName?: string;
}
