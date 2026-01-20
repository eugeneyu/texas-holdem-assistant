import { Hand } from 'pokersolver';
import { Card, Rank, Suit } from '../types';

// Convert our Card object to pokersolver string (e.g. {rank:'A', suit:'h'} -> "Ah")
// Note: pokersolver expects '10' as 'T' usually, but let's check. 
// Standard notation is T, but pokersolver might handle 10. 
// Looking at docs/examples usually T is standard. 
// My Rank type has 'T', so "Th" is correct.
export const cardToString = (card: Card): string => {
  return `${card.rank}${card.suit}`;
};

export const getHandStrength = (heroCards: Card[], communityCards: Card[]): string => {
  if (heroCards.length !== 2) return '';
  const allCards = [...heroCards, ...communityCards].map(cardToString);
  if (allCards.length < 5) {
      // Pre-flop or incomplete board, just solve what we have if possible, 
      // but pokersolver needs 5-7 cards usually for a full hand.
      // If < 5, we can't really say "Two Pair" yet unless we solve partial.
      // Pokersolver can handle < 5? Probably not reliably for "name".
      return '';
  }
  const hand = Hand.solve(allCards);
  return hand.name;
};

// Simple Deck implementation for simulation
const ALL_RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const ALL_SUITS: Suit[] = ['h', 'd', 'c', 's'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const s of ALL_SUITS) {
    for (const r of ALL_RANKS) {
      deck.push({ rank: r, suit: s });
    }
  }
  return deck;
};

const removeCards = (deck: Card[], cardsToRemove: Card[]) => {
  return deck.filter(c => !cardsToRemove.some(r => r.rank === c.rank && r.suit === c.suit));
};

const shuffle = (deck: Card[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const calculateEquity = (
  heroCards: [Card | null, Card | null],
  communityCards: Card[],
  activeOpponents: number,
  iterations: number = 1000
): number => {
  if (!heroCards[0] || !heroCards[1]) return 0;
  
  const knownCards = [...(heroCards as Card[]), ...communityCards];
  const deck = removeCards(createDeck(), knownCards);
  
  let wins = 0;
  let ties = 0;

  for (let i = 0; i < iterations; i++) {
    const shuffledDeck = shuffle([...deck]);
    
    // Deal remaining community cards
    const simCommunity = [...communityCards];
    while (simCommunity.length < 5) {
      simCommunity.push(shuffledDeck.pop()!);
    }
    
    const heroHandStr = [...(heroCards as Card[]), ...simCommunity].map(cardToString);
    const heroHand = Hand.solve(heroHandStr);
    
    let heroWon = true;
    let isTie = false;

    // Deal opponent hands
    for (let j = 0; j < activeOpponents; j++) {
      const oppCards = [shuffledDeck.pop()!, shuffledDeck.pop()!];
      const oppHandStr = [...oppCards, ...simCommunity].map(cardToString);
      const oppHand = Hand.solve(oppHandStr);
      
      const winner = Hand.winners([heroHand, oppHand]);
      if (winner.length > 1) { // Tie
          // If we tie with someone, and haven't lost to anyone else yet...
          // For simplicity in this fast sim, if we tie best hand so far, we count it as partial?
          // Let's simplify: if hero is not the sole winner, check if he is IN the winners.
          if (!winner.includes(heroHand)) {
              heroWon = false;
              break;
          } else {
              isTie = true;
          }
      } else if (winner[0] !== heroHand) {
        heroWon = false;
        break;
      }
    }

    if (heroWon) {
      if (isTie) ties++;
      else wins++;
    }
  }

  // Equity = (Wins + Ties/2) / Iterations (Roughly)
  return ((wins + ties / 2) / iterations) * 100;
};

export const getPotOdds = (toCall: number, totalPot: number): number => {
  if (toCall <= 0) return 0;
  return (toCall / (totalPot + toCall)) * 100;
};

export const getAdvice = (equity: number, potOdds: number): { action: 'FOLD' | 'CALL' | 'RAISE', color: string } => {
  // Simple EV based advice
  // If Equity > Pot Odds, it's +EV to call.
  // If Equity is significantly higher, Raise.
  
  if (equity > potOdds + 10) {
    return { action: 'RAISE', color: 'text-poker-green' };
  } else if (equity >= potOdds) {
    return { action: 'CALL', color: 'text-poker-green' }; // or yellow/gold
  } else {
    return { action: 'FOLD', color: 'text-poker-red' };
  }
};
