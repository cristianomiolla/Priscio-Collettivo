export type Gender = 'male' | 'female' | 'any';

export type Stage = 'first-date' | 'engagement' | 'living-together' | 'marriage' | 'kids';

export interface RedFlag {
  id: number;
  category: string;
  image: string;
  maleText: string;
  femaleText: string;
}

export interface AcceptedFlag {
  flag: RedFlag;
  stageIndex: number;
}

export interface Player {
  id: string;
  name: string;
  partnerGender: Gender;
  acceptedFlags: AcceptedFlag[];
  rejectedCount: number;
  totalAttempts: number;
  currentStageIndex: number;
  currentPartnerName: string | null;
  usedFlagIds: Set<number>;
}

export interface Partner {
  name: string;
  gender: 'male' | 'female';
}

export interface Turn {
  playerId: string;
  stageIndex: number;
  partner: Partner;
  redFlag: RedFlag;
  /** Red flags accepted so far for this partner in the current turn */
  acceptedInTurn: RedFlag[];
}

export type Screen = 'home' | 'setup' | 'turn-intro' | 'suspense' | 'swipe' | 'results' | 'green-flag-offer';

export interface GreenFlagOffer {
  greenFlag: RedFlag;
  /** The turn state at the moment of rejection (before the reject was applied) */
  originalTurn: Turn;
}

export interface GameState {
  screen: Screen;
  players: Player[];
  currentPlayerIndex: number;
  currentTurn: Turn | null;
  globalUsedFlagIds: Set<number>;
  isFinished: boolean;
  /** When set, the player is being offered a green flag to save a rejected partner */
  greenFlagOffer: GreenFlagOffer | null;
}

export interface PlayerStatistics {
  player: Player;
  acceptedCount: number;
  rejectedCount: number;
  totalAttempts: number;
  acceptRate: number;
  finalPartnerName: string | null;
  luckLevel: string;
  badges: Badge[];
}

export interface Badge {
  icon: string;
  title: string;
  description: string;
}
