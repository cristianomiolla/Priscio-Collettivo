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

export const GREEN_FLAG_CHANCE = 0.10;

export const MAX_ACCEPT_PER_TURN = 5;

export const EX_PARTNER_CHANCE = 0.15;

export const FLAMEBACK_CHANCE = 0.15;

// URL dello script Google Apps Script per ricevere proposte di red flag.
// Segui le istruzioni nel README per creare lo script e incolla qui l'URL.
export const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyWHi5sPuIZGmp8HKsPTuXXUl5L3gHjn8iIrYQaLKQpwzC9A-dNXuJNSV41BRWOgN5YQw/exec';
