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

export type Screen = 'home' | 'setup' | 'turn-intro' | 'suspense' | 'roulette' | 'swipe' | 'results' | 'green-flag-offer' | 'ex-partner-offer' | 'flameback-offer';

export interface GreenFlagOffer {
  greenFlag: RedFlag;
  /** The turn state at the moment of rejection (before the reject was applied) */
  originalTurn: Turn;
}

/** A partner that was rejected and can be offered to a different player */
export interface RejectedPartner {
  partner: Partner;
  /** Red flags that were revealed (accepted) before the rejection */
  revealedFlags: RedFlag[];
  /** The red flag that caused the rejection */
  rejectionFlag: RedFlag;
  /** ID of the player who rejected this partner */
  rejectedByPlayerId: string;
  /** Name of the player who rejected this partner (for display) */
  rejectedByPlayerName: string;
}

export interface ExPartnerOffer {
  rejectedPartner: RejectedPartner;
}

/** A partner the same player rejected that comes back "changed" (ritorno di fiamma) */
export interface FlamebackOffer {
  rejectedPartner: RejectedPartner;
  /** The new red flag replacing the rejection flag */
  newFlag: RedFlag;
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
  /** Pool of rejected partners available for recycling */
  rejectedPartners: RejectedPartner[];
  /** When set, the player is being offered an ex partner */
  exPartnerOffer: ExPartnerOffer | null;
  /** When set, a rejected partner returns to the same player (ritorno di fiamma) */
  flamebackOffer: FlamebackOffer | null;
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
