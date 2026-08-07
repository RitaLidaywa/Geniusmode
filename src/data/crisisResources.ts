export interface CrisisResource {
  region: string;
  name: string;
  contact: string;
  description: string;
}

// General, well-known crisis lines. Shown as a static safety net, not a
// substitute for the app doing any kind of real-time risk detection.
export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    region: 'United States',
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or text 988',
    description: 'Free, confidential support 24/7 for anyone in emotional distress.',
  },
  {
    region: 'United States',
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    description: '24/7 text-based support from a trained crisis counselor.',
  },
  {
    region: 'United Kingdom & Ireland',
    name: 'Samaritans',
    contact: 'Call 116 123',
    description: 'Free 24/7 confidential emotional support.',
  },
  {
    region: 'International',
    name: 'Find a Helpline',
    contact: 'findahelpline.com',
    description: 'Directory of crisis lines by country.',
  },
];
