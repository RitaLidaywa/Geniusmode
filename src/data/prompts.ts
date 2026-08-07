export const JOURNAL_PROMPTS: string[] = [
  'What am I feeling right now, without judging it?',
  'What is one thing about this relationship I am grateful I learned?',
  'What would I say to a close friend going through exactly this?',
  'What is one small thing I did today to take care of myself?',
  'What do I need to hear right now that I have not been telling myself?',
  'What is a memory I want to hold onto, and what is one I am ready to release?',
  'What does my life look like six months from now, once I have healed?',
  'What part of myself did I lose sight of in this relationship, and how can I reconnect with it?',
  'What am I afraid of right now, and is that fear actually true?',
  'What is one boundary I want to honor for myself going forward?',
  'Who in my life can I lean on today?',
  'What is something I am proud of myself for, even if it is small?',
];

export function getPromptForDate(date: Date): string {
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  return JOURNAL_PROMPTS[dayIndex % JOURNAL_PROMPTS.length];
}
