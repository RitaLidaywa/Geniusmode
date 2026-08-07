import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { ALL_STORAGE_KEYS, STORAGE_KEYS } from './keys';
import type {
  AppSettings,
  JournalEntry,
  MoodEntry,
  ReframeEntry,
  StreakData,
  UnsentLetter,
} from '../types';

export function generateId(): string {
  return Crypto.randomUUID();
}

async function readList<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

// ---------- Streak ----------

export async function getStreak(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.streak);
  if (!raw) {
    const fresh: StreakData = {
      startDate: new Date().toISOString(),
      resets: [],
      longestStreakDays: 0,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(raw) as StreakData;
}

export async function resetStreak(): Promise<StreakData> {
  const current = await getStreak();
  const daysBeforeReset = Math.floor(
    (Date.now() - new Date(current.startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  const updated: StreakData = {
    startDate: new Date().toISOString(),
    resets: [
      ...current.resets,
      { id: generateId(), date: new Date().toISOString(), daysBeforeReset },
    ],
    longestStreakDays: Math.max(current.longestStreakDays, daysBeforeReset),
  };
  await AsyncStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(updated));
  return updated;
}

// ---------- Journal ----------

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const items = await readList<JournalEntry>(STORAGE_KEYS.journalEntries);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveJournalEntry(
  entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<JournalEntry> {
  const items = await readList<JournalEntry>(STORAGE_KEYS.journalEntries);
  const now = new Date().toISOString();
  const newEntry: JournalEntry = { ...entry, id: generateId(), createdAt: now, updatedAt: now };
  await writeList(STORAGE_KEYS.journalEntries, [...items, newEntry]);
  return newEntry;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const items = await readList<JournalEntry>(STORAGE_KEYS.journalEntries);
  await writeList(
    STORAGE_KEYS.journalEntries,
    items.filter((item) => item.id !== id),
  );
}

// ---------- Mood ----------

export async function getMoodEntries(): Promise<MoodEntry[]> {
  const items = await readList<MoodEntry>(STORAGE_KEYS.moodEntries);
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function saveMoodEntry(
  entry: Omit<MoodEntry, 'id' | 'createdAt'>,
): Promise<MoodEntry> {
  const items = await readList<MoodEntry>(STORAGE_KEYS.moodEntries);
  const withoutSameDay = items.filter((item) => item.date !== entry.date);
  const newEntry: MoodEntry = { ...entry, id: generateId(), createdAt: new Date().toISOString() };
  await writeList(STORAGE_KEYS.moodEntries, [...withoutSameDay, newEntry]);
  return newEntry;
}

// ---------- Reframe (CBT) ----------

export async function getReframeEntries(): Promise<ReframeEntry[]> {
  const items = await readList<ReframeEntry>(STORAGE_KEYS.reframeEntries);
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function saveReframeEntry(
  entry: Omit<ReframeEntry, 'id' | 'date'>,
): Promise<ReframeEntry> {
  const items = await readList<ReframeEntry>(STORAGE_KEYS.reframeEntries);
  const newEntry: ReframeEntry = { ...entry, id: generateId(), date: new Date().toISOString() };
  await writeList(STORAGE_KEYS.reframeEntries, [...items, newEntry]);
  return newEntry;
}

// ---------- Unsent letters ----------

export async function getUnsentLetters(): Promise<UnsentLetter[]> {
  const items = await readList<UnsentLetter>(STORAGE_KEYS.unsentLetters);
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function saveUnsentLetter(
  entry: Omit<UnsentLetter, 'id' | 'date'>,
): Promise<UnsentLetter> {
  const items = await readList<UnsentLetter>(STORAGE_KEYS.unsentLetters);
  const newEntry: UnsentLetter = { ...entry, id: generateId(), date: new Date().toISOString() };
  await writeList(STORAGE_KEYS.unsentLetters, [...items, newEntry]);
  return newEntry;
}

export async function deleteUnsentLetter(id: string): Promise<void> {
  const items = await readList<UnsentLetter>(STORAGE_KEYS.unsentLetters);
  await writeList(
    STORAGE_KEYS.unsentLetters,
    items.filter((item) => item.id !== id),
  );
}

// ---------- Settings ----------

const DEFAULT_SETTINGS: AppSettings = {
  appLockEnabled: false,
  hasCompletedOnboarding: false,
};

export async function getSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

// ---------- Data management (privacy compliance) ----------

export async function exportAllData(): Promise<string> {
  const entries = await Promise.all(
    ALL_STORAGE_KEYS.map(async (key) => [key, await AsyncStorage.getItem(key)] as const),
  );
  const data = Object.fromEntries(entries);
  return JSON.stringify(data, null, 2);
}

export async function deleteAllData(): Promise<void> {
  await AsyncStorage.removeMany(ALL_STORAGE_KEYS as string[]);
}
