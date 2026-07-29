import type { Stage } from './types';

export const STAGES: { id: Stage; label: string; emoji: string }[] = [
  { id: 'first-date', label: 'Primo appuntamento', emoji: '💕' },
  { id: 'engagement', label: 'Fidanzamento', emoji: '💍' },
  { id: 'living-together', label: 'Convivenza', emoji: '🏠' },
  { id: 'marriage', label: 'Matrimonio', emoji: '👰' },
  { id: 'kids', label: 'Figli', emoji: '👶' },
];

export const NUM_STAGES = STAGES.length;

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 10;

export const SUSPENSE_DURATION_MS = 2000;

export const GREEN_FLAG_CHANCE = 0.05;

export const MAX_ACCEPT_PER_TURN = 5;

export const EX_PARTNER_CHANCE = 0.15;

export const FLAMEBACK_CHANCE = 0.15;
