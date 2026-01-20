export type Suit = 'h' | 'd' | 'c' | 's'; // hearts, diamonds, clubs, spades
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type PlayerPosition = 'SB' | 'BB' | 'UTG' | 'UTG+1' | 'UTG+2' | 'LJ' | 'HJ' | 'CO' | 'BTN';

export type GameStage = 'setup' | 'preflop' | 'flop' | 'turn' | 'river';

export interface GameState {
  numPlayers: number;
  userPosition: PlayerPosition;
  bigBlindAmount: number;
  heroCards: [Card | null, Card | null];
  communityCards: Card[];
  potSize: number;
  currentStage: GameStage;
  activeOpponents: number; // For calculations
}

export const POSITIONS: PlayerPosition[] = ['SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN'];
