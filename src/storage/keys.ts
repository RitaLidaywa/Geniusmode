export const STORAGE_KEYS = {
  streak: 'imtb:streak:v1',
  journalEntries: 'imtb:journal:v1',
  moodEntries: 'imtb:mood:v1',
  reframeEntries: 'imtb:reframe:v1',
  unsentLetters: 'imtb:letters:v1',
  settings: 'imtb:settings:v1',
} as const;

export const ALL_STORAGE_KEYS = Object.values(STORAGE_KEYS);
