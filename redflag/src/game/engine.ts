import type { Player, Partner, RedFlag, GameState, Turn, Gender, PlayerStatistics, Badge, RejectedPartner } from '../types';
import { NUM_STAGES, GREEN_FLAG_CHANCE, MAX_ACCEPT_PER_TURN, EX_PARTNER_CHANCE } from '../config';
import nomiMaschili from '../data/nomi_maschili.json';
import nomiFemminili from '../data/nomi_femminili.json';
import redflagsData from '../data/redflags.json';

const allRedFlags: RedFlag[] = redflagsData as RedFlag[];

// --- Green flags (positive traits shown with 5% chance) ---

const greenFlags: RedFlag[] = [
  { id: 9000, category: 'green', image: '', maleText: 'È molto ricco', femaleText: 'È molto ricca' },
  { id: 9001, category: 'green', image: '', maleText: 'È un cuoco stellato', femaleText: 'È una cuoca stellata' },
  { id: 9002, category: 'green', image: '', maleText: 'Ha un attico in centro', femaleText: 'Ha un attico in centro' },
  { id: 9003, category: 'green', image: '', maleText: 'Ti porta in vacanza ogni mese', femaleText: 'Ti porta in vacanza ogni mese' },
  { id: 9004, category: 'green', image: '', maleText: 'Ha il fisico di un modello', femaleText: 'Ha il fisico di una modella' },
  { id: 9005, category: 'green', image: '', maleText: 'I suoi amici ti adorano', femaleText: 'Le sue amiche ti adorano' },
  { id: 9006, category: 'green', image: '', maleText: 'Non guarda mai il telefono quando state insieme', femaleText: 'Non guarda mai il telefono quando state insieme' },
  { id: 9007, category: 'green', image: '', maleText: 'Ti difende sempre davanti agli altri', femaleText: 'Ti difende sempre davanti agli altri' },
  { id: 9008, category: 'green', image: '', maleText: 'Ha un senso dell\'umorismo pazzesco', femaleText: 'Ha un senso dell\'umorismo pazzesco' },
  { id: 9009, category: 'green', image: '', maleText: 'Ti fa i massaggi senza che tu lo chieda', femaleText: 'Ti fa i massaggi senza che tu lo chieda' },
  { id: 9010, category: 'green', image: '', maleText: 'Ha la macchina dei tuoi sogni', femaleText: 'Ha la macchina dei tuoi sogni' },
  { id: 9011, category: 'green', image: '', maleText: 'Ti organizza sorprese a caso', femaleText: 'Ti organizza sorprese a caso' },
  { id: 9012, category: 'green', image: '', maleText: 'Va d\'accordo perfettamente con i tuoi amici', femaleText: 'Va d\'accordo perfettamente con le tue amiche' },
  { id: 9013, category: 'green', image: '', maleText: 'Ti porta la pizza a casa senza chiedere', femaleText: 'Ti porta la pizza a casa senza chiedere' },
  { id: 9014, category: 'green', image: '', maleText: 'Ha un golden retriever adorabile', femaleText: 'Ha un golden retriever adorabile' },
];

// --- Utility ---

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// --- Player ---

export function createPlayer(name: string, partnerGender: Gender): Player {
  return {
    id: generateId(),
    name,
    partnerGender,
    acceptedFlags: [],
    rejectedCount: 0,
    totalAttempts: 0,
    currentStageIndex: 0,
    currentPartnerName: null,
    usedFlagIds: new Set(),
  };
}

// --- Partner generation ---

function resolveGender(preference: Gender): 'male' | 'female' {
  if (preference === 'any') {
    return Math.random() < 0.5 ? 'male' : 'female';
  }
  return preference;
}

export function generatePartner(preference: Gender): Partner {
  const gender = resolveGender(preference);
  const names = gender === 'male' ? nomiMaschili : nomiFemminili;
  return {
    name: randomItem(names),
    gender,
  };
}

// --- Red flag extraction ---

function pickRedFlag(
  globalUsedIds: Set<number>,
): { flag: RedFlag; resetGlobal: boolean } | null {
  let available = allRedFlags.filter((f) => !globalUsedIds.has(f.id));

  // All flags exhausted globally — reset and allow all again
  if (available.length === 0) {
    available = allRedFlags;
    if (available.length === 0) return null;
    return { flag: randomItem(available), resetGlobal: true };
  }

  return { flag: randomItem(available), resetGlobal: false };
}

// --- Game state ---

export function createInitialState(): GameState {
  return {
    screen: 'home',
    players: [],
    currentPlayerIndex: 0,
    currentTurn: null,
    globalUsedFlagIds: new Set(),
    isFinished: false,
    greenFlagOffer: null,
    rejectedPartners: [],
    exPartnerOffer: null,
  };
}

export function startGame(players: Player[]): GameState {
  return {
    screen: 'turn-intro',
    players,
    currentPlayerIndex: 0,
    currentTurn: null,
    globalUsedFlagIds: new Set(),
    isFinished: false,
    greenFlagOffer: null,
    rejectedPartners: [],
    exPartnerOffer: null,
  };
}

// --- Turn ---

export function generateTurn(state: GameState, keepPartner?: Partner, previousAccepted?: RedFlag[]): Turn | null {
  const player = state.players[state.currentPlayerIndex];
  const partner = keepPartner ?? generatePartner(player.partnerGender);

  const result = pickRedFlag(state.globalUsedFlagIds);
  if (!result) return null;

  // If all flags were exhausted, reset the global pool for the next round
  if (result.resetGlobal) {
    state.globalUsedFlagIds.clear();
  }

  return {
    playerId: player.id,
    stageIndex: player.currentStageIndex,
    partner,
    redFlag: result.flag,
    acceptedInTurn: previousAccepted ?? [],
  };
}

// --- Accept / Reject ---

export function acceptFlag(state: GameState): GameState {
  if (!state.currentTurn) return state;

  const turn = state.currentTurn;
  const newAcceptedInTurn = [...turn.acceptedInTurn, turn.redFlag];
  const turnComplete = newAcceptedInTurn.length >= MAX_ACCEPT_PER_TURN;

  const players = state.players.map((p) => {
    if (p.id !== turn.playerId) return p;

    const newUsedIds = new Set(p.usedFlagIds);
    newUsedIds.add(turn.redFlag.id);

    return {
      ...p,
      acceptedFlags: [...p.acceptedFlags, { flag: turn.redFlag, stageIndex: p.currentStageIndex }],
      totalAttempts: p.totalAttempts + 1,
      currentStageIndex: p.currentStageIndex + 1,
      currentPartnerName: turn.partner.name,
      usedFlagIds: newUsedIds,
    };
  });

  const globalUsedFlagIds = new Set(state.globalUsedFlagIds);
  globalUsedFlagIds.add(turn.redFlag.id);

  if (turnComplete) {
    // Turn is over — move to next player or finish
    const nextPlayerIndex = getNextPlayerIndex(players, state.currentPlayerIndex);
    const isFinished = players.every((p) => p.currentStageIndex >= NUM_STAGES);

    return {
      ...state,
      players,
      currentPlayerIndex: nextPlayerIndex,
      currentTurn: null,
      globalUsedFlagIds,
      isFinished,
      screen: isFinished ? 'results' : 'turn-intro',
    };
  }

  // Still same partner — generate a new red flag for them
  const updatedState: GameState = {
    ...state,
    players,
    globalUsedFlagIds,
  };

  const nextTurn = generateTurn(updatedState, turn.partner, newAcceptedInTurn);

  return {
    ...updatedState,
    currentTurn: nextTurn,
    screen: 'suspense',
  };
}

export function rejectFlag(state: GameState): GameState {
  if (!state.currentTurn) return state;

  const turn = state.currentTurn;

  // Roll for green flag rescue (only if not already in a green flag offer)
  if (!state.greenFlagOffer && Math.random() < GREEN_FLAG_CHANCE) {
    const greenFlag = randomItem(greenFlags);
    return {
      ...state,
      greenFlagOffer: {
        greenFlag,
        originalTurn: turn,
      },
      screen: 'green-flag-offer',
    };
  }

  const rejectingPlayer = state.players.find((p) => p.id === turn.playerId)!;

  const players = state.players.map((p) => {
    if (p.id !== turn.playerId) return p;

    const newUsedIds = new Set(p.usedFlagIds);
    newUsedIds.add(turn.redFlag.id);

    return {
      ...p,
      rejectedCount: p.rejectedCount + 1,
      totalAttempts: p.totalAttempts + 1,
      currentStageIndex: 0,
      usedFlagIds: newUsedIds,
    };
  });

  const globalUsedFlagIds = new Set(state.globalUsedFlagIds);
  globalUsedFlagIds.add(turn.redFlag.id);

  // Save rejected partner to the pool (only if multiplayer)
  const rejectedPartners = [...state.rejectedPartners];
  if (state.players.length > 1) {
    rejectedPartners.push({
      partner: turn.partner,
      revealedFlags: turn.acceptedInTurn,
      rejectionFlag: turn.redFlag,
      rejectedByPlayerId: turn.playerId,
      rejectedByPlayerName: rejectingPlayer.name,
    });
  }

  // Move to the next player
  const nextPlayerIndex = getNextPlayerIndex(players, state.currentPlayerIndex);

  return {
    ...state,
    players,
    currentPlayerIndex: nextPlayerIndex,
    currentTurn: null,
    globalUsedFlagIds,
    greenFlagOffer: null,
    rejectedPartners,
    screen: 'turn-intro',
  };
}

// --- Green flag offer: accept (save the partner, continue the turn) ---

export function acceptGreenFlag(state: GameState): GameState {
  if (!state.greenFlagOffer) return state;

  const { greenFlag, originalTurn } = state.greenFlagOffer;
  const newAcceptedInTurn = [...originalTurn.acceptedInTurn, originalTurn.redFlag];

  const players = state.players.map((p) => {
    if (p.id !== originalTurn.playerId) return p;

    const newUsedIds = new Set(p.usedFlagIds);
    newUsedIds.add(originalTurn.redFlag.id);

    return {
      ...p,
      acceptedFlags: [
        ...p.acceptedFlags,
        { flag: originalTurn.redFlag, stageIndex: p.currentStageIndex },
        { flag: greenFlag, stageIndex: -1 },
      ],
      totalAttempts: p.totalAttempts + 1,
      currentStageIndex: p.currentStageIndex + 1,
      currentPartnerName: originalTurn.partner.name,
      usedFlagIds: newUsedIds,
    };
  });

  const globalUsedFlagIds = new Set(state.globalUsedFlagIds);
  globalUsedFlagIds.add(originalTurn.redFlag.id);

  const turnComplete = newAcceptedInTurn.length >= MAX_ACCEPT_PER_TURN;

  if (turnComplete) {
    const nextPlayerIndex = getNextPlayerIndex(players, state.currentPlayerIndex);
    const isFinished = players.every((p) => p.currentStageIndex >= NUM_STAGES);

    return {
      ...state,
      players,
      currentPlayerIndex: nextPlayerIndex,
      currentTurn: null,
      globalUsedFlagIds,
      isFinished,
      greenFlagOffer: null,
      screen: isFinished ? 'results' : 'turn-intro',
    };
  }

  // Continue with same partner — generate next red flag
  const updatedState: GameState = {
    ...state,
    players,
    globalUsedFlagIds,
    greenFlagOffer: null,
  };

  const nextTurn = generateTurn(updatedState, originalTurn.partner, newAcceptedInTurn);

  return {
    ...updatedState,
    currentTurn: nextTurn,
    screen: 'suspense',
  };
}

// --- Green flag offer: reject (confirm rejection, end the turn) ---

export function rejectGreenFlag(state: GameState): GameState {
  if (!state.greenFlagOffer) return state;

  const { originalTurn } = state.greenFlagOffer;
  const rejectingPlayer = state.players.find((p) => p.id === originalTurn.playerId)!;

  const players = state.players.map((p) => {
    if (p.id !== originalTurn.playerId) return p;

    const newUsedIds = new Set(p.usedFlagIds);
    newUsedIds.add(originalTurn.redFlag.id);

    return {
      ...p,
      rejectedCount: p.rejectedCount + 1,
      totalAttempts: p.totalAttempts + 1,
      currentStageIndex: 0,
      usedFlagIds: newUsedIds,
    };
  });

  const globalUsedFlagIds = new Set(state.globalUsedFlagIds);
  globalUsedFlagIds.add(originalTurn.redFlag.id);

  // Save rejected partner to the pool (only if multiplayer)
  const rejectedPartners = [...state.rejectedPartners];
  if (state.players.length > 1) {
    rejectedPartners.push({
      partner: originalTurn.partner,
      revealedFlags: originalTurn.acceptedInTurn,
      rejectionFlag: originalTurn.redFlag,
      rejectedByPlayerId: originalTurn.playerId,
      rejectedByPlayerName: rejectingPlayer.name,
    });
  }

  const nextPlayerIndex = getNextPlayerIndex(players, state.currentPlayerIndex);

  return {
    ...state,
    players,
    currentPlayerIndex: nextPlayerIndex,
    currentTurn: null,
    globalUsedFlagIds,
    greenFlagOffer: null,
    rejectedPartners,
    screen: 'turn-intro',
  };
}

// --- Ex-partner offer: try to offer a recycled partner at turn start ---

export function tryExPartnerOffer(state: GameState): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];

  // Find eligible ex partners: not rejected by this player, matching gender preference
  const eligible = state.rejectedPartners.filter((rp) => {
    if (rp.rejectedByPlayerId === currentPlayer.id) return false;
    if (currentPlayer.partnerGender === 'any') return true;
    return rp.partner.gender === currentPlayer.partnerGender;
  });

  if (eligible.length === 0) return state;
  if (Math.random() >= EX_PARTNER_CHANCE) return state;

  const chosen = randomItem(eligible);

  return {
    ...state,
    exPartnerOffer: { rejectedPartner: chosen },
    screen: 'ex-partner-offer',
  };
}

// --- Ex-partner offer: accept (start turn with this partner, revealed flags pre-accepted) ---

export function acceptExPartner(state: GameState): GameState {
  if (!state.exPartnerOffer) return state;

  const { rejectedPartner } = state.exPartnerOffer;
  const currentPlayer = state.players[state.currentPlayerIndex];

  // All previously revealed flags + the rejection flag = flags already known
  const allKnownFlags = [...rejectedPartner.revealedFlags, rejectedPartner.rejectionFlag];

  // Pre-accept all known flags for this player
  const players = state.players.map((p) => {
    if (p.id !== currentPlayer.id) return p;

    const newUsedIds = new Set(p.usedFlagIds);
    allKnownFlags.forEach((f) => newUsedIds.add(f.id));

    return {
      ...p,
      acceptedFlags: [
        ...p.acceptedFlags,
        ...allKnownFlags.map((flag) => ({ flag, stageIndex: p.currentStageIndex })),
      ],
      totalAttempts: p.totalAttempts + allKnownFlags.length,
      currentStageIndex: p.currentStageIndex + allKnownFlags.length,
      currentPartnerName: rejectedPartner.partner.name,
      usedFlagIds: newUsedIds,
    };
  });

  const globalUsedFlagIds = new Set(state.globalUsedFlagIds);
  allKnownFlags.forEach((f) => globalUsedFlagIds.add(f.id));

  // Remove this partner from the rejected pool
  const rejectedPartners = state.rejectedPartners.filter((rp) => rp !== rejectedPartner);

  const updatedPlayer = players[state.currentPlayerIndex];

  // Check if the turn is already complete (all 5 stages filled)
  if (updatedPlayer.currentStageIndex >= NUM_STAGES) {
    const nextPlayerIndex = getNextPlayerIndex(players, state.currentPlayerIndex);
    const isFinished = players.every((p) => p.currentStageIndex >= NUM_STAGES);

    return {
      ...state,
      players,
      currentPlayerIndex: nextPlayerIndex,
      currentTurn: null,
      globalUsedFlagIds,
      isFinished,
      exPartnerOffer: null,
      rejectedPartners,
      screen: isFinished ? 'results' : 'turn-intro',
    };
  }

  // Continue: generate next red flag for the same partner
  const updatedState: GameState = {
    ...state,
    players,
    globalUsedFlagIds,
    exPartnerOffer: null,
    rejectedPartners,
  };

  const nextTurn = generateTurn(updatedState, rejectedPartner.partner, allKnownFlags);

  return {
    ...updatedState,
    currentTurn: nextTurn,
    screen: 'suspense',
  };
}

// --- Ex-partner offer: reject (partner is removed permanently, proceed normally) ---

export function rejectExPartner(state: GameState): GameState {
  if (!state.exPartnerOffer) return state;

  // Remove this partner permanently from the pool
  const rejectedPartners = state.rejectedPartners.filter(
    (rp) => rp !== state.exPartnerOffer!.rejectedPartner,
  );

  return {
    ...state,
    exPartnerOffer: null,
    rejectedPartners,
    screen: 'turn-intro',
  };
}

// --- End game early ---

export function endGameEarly(state: GameState): GameState {
  return {
    ...state,
    currentTurn: null,
    isFinished: true,
    greenFlagOffer: null,
    exPartnerOffer: null,
    screen: 'results',
  };
}

// --- Navigation helpers ---

function getNextPlayerIndex(players: Player[], currentIndex: number): number {
  const total = players.length;
  for (let i = 1; i <= total; i++) {
    const idx = (currentIndex + i) % total;
    if (players[idx].currentStageIndex < NUM_STAGES) {
      return idx;
    }
  }
  return currentIndex;
}

// --- Statistics & Badges ---

function calculateLuckLevel(acceptRate: number): string {
  if (acceptRate >= 90) return 'Leggendario';
  if (acceptRate >= 70) return 'Molto fortunato';
  if (acceptRate >= 50) return 'Nella media';
  if (acceptRate >= 30) return 'Sfortunato';
  return 'Disastroso';
}

function assignBadges(player: Player): Badge[] {
  const badges: Badge[] = [];

  // Accepted everything on first try (no rejections)
  if (player.rejectedCount === 0) {
    badges.push({
      icon: '💀',
      title: 'Disperato romantico',
      description: 'Ha accettato tutto subito.',
    });
  }

  // Rejected a lot
  if (player.rejectedCount >= NUM_STAGES * 2) {
    badges.push({
      icon: '👃',
      title: 'Schizzinoso',
      description: 'Ha rifiutato tantissimi partner.',
    });
  }

  // High acceptance rate (but not 100%)
  if (player.rejectedCount > 0 && player.rejectedCount <= 1) {
    badges.push({
      icon: '💛',
      title: 'Cuore d\'oro',
      description: 'Accetta quasi tutto.',
    });
  }

  // Saw many partners
  if (player.totalAttempts >= NUM_STAGES * 3) {
    badges.push({
      icon: '🔄',
      title: 'Selettore seriale',
      description: 'Ha visto tantissimi partner.',
    });
  }

  // Accepted the worst categories
  const igieneCount = player.acceptedFlags.filter((af) => af.flag.category === 'igiene').length;
  if (igieneCount >= 2) {
    badges.push({
      icon: '🤢',
      title: 'Iron Stomach',
      description: 'Ha accettato le peggiori red flag.',
    });
  }

  // Got a green flag
  const greenCount = player.acceptedFlags.filter((af) => af.flag.category === 'green').length;
  if (greenCount > 0) {
    badges.push({
      icon: '🍀',
      title: 'Baciato dalla fortuna',
      description: 'Ha trovato una green flag!',
    });
  }

  // Low rejection count relative to attempts
  const redFlagCount = player.acceptedFlags.filter((af) => af.flag.category !== 'green').length;
  const acceptRate = player.totalAttempts > 0
    ? (redFlagCount / player.totalAttempts) * 100
    : 0;
  if (acceptRate >= 80 && player.totalAttempts >= NUM_STAGES) {
    badges.push({
      icon: '🎯',
      title: 'Fortunello',
      description: 'Ha trovato ottimi partner.',
    });
  }

  return badges;
}

export function calculateStatistics(players: Player[]): PlayerStatistics[] {
  return players.map((player) => {
    const redFlagCount = player.acceptedFlags.filter((af) => af.flag.category !== 'green').length;
    const acceptRate = player.totalAttempts > 0
      ? (redFlagCount / player.totalAttempts) * 100
      : 0;

    return {
      player,
      acceptedCount: redFlagCount,
      rejectedCount: player.rejectedCount,
      totalAttempts: player.totalAttempts,
      acceptRate: Math.round(acceptRate),
      finalPartnerName: player.currentPartnerName,
      luckLevel: calculateLuckLevel(acceptRate),
      badges: assignBadges(player),
    };
  });
}

// --- LocalStorage persistence ---

const STORAGE_KEY = 'redflag-game-state';

interface SerializedGameState {
  screen: string;
  players: Array<Omit<Player, 'usedFlagIds'> & { usedFlagIds: number[] }>;
  currentPlayerIndex: number;
  currentTurn: Turn | null;
  globalUsedFlagIds: number[];
  isFinished: boolean;
  rejectedPartners?: RejectedPartner[];
}

export function saveGameState(state: GameState): void {
  // Only persist during active game (green-flag-offer resumes as turn-intro)
  if (state.screen === 'home' || state.screen === 'results') {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  const serialized: SerializedGameState = {
    screen: state.screen,
    players: state.players.map((p) => ({
      ...p,
      usedFlagIds: [...p.usedFlagIds],
    })),
    currentPlayerIndex: state.currentPlayerIndex,
    currentTurn: state.currentTurn,
    globalUsedFlagIds: [...state.globalUsedFlagIds],
    isFinished: state.isFinished,
    rejectedPartners: state.rejectedPartners,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: SerializedGameState = JSON.parse(raw);

    return {
      screen: data.screen as GameState['screen'],
      players: data.players.map((p) => ({
        ...p,
        usedFlagIds: new Set(p.usedFlagIds),
      })),
      currentPlayerIndex: data.currentPlayerIndex,
      currentTurn: data.currentTurn ?? null,
      globalUsedFlagIds: new Set(data.globalUsedFlagIds),
      isFinished: data.isFinished,
      greenFlagOffer: null,
      rejectedPartners: data.rejectedPartners ?? [],
      exPartnerOffer: null,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(STORAGE_KEY);
}
