import React, { useState, useEffect } from 'react';
import { GameState, Card } from '../types';
import { CardDisplay } from './CardDisplay';
import { CardSelector } from './CardSelector';
import { calculateEquity, getPotOdds, getAdvice, getHandStrength } from '../lib/poker';
import classNames from 'classnames';
import { RotateCcw, DollarSign } from 'lucide-react';

interface DashboardProps {
  gameState: GameState;
  onUpdateState: (newState: Partial<GameState>) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ gameState, onUpdateState, onReset }) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectionTarget, setSelectionTarget] = useState<{ type: 'hero' | 'community', index: number } | null>(null);
  
  const [toCall, setToCall] = useState(0); // Amount to call for pot odds
  const [equity, setEquity] = useState(0);
  const [handName, setHandName] = useState('');

  // Calculations
  useEffect(() => {
    // Run simulation
    if (gameState.heroCards[0] && gameState.heroCards[1]) {
      // Use setTimeout to not block UI
      const timer = setTimeout(() => {
        const eq = calculateEquity(
          gameState.heroCards, 
          gameState.communityCards, 
          gameState.activeOpponents
        );
        setEquity(eq);
        
        const strength = getHandStrength(
          gameState.heroCards as Card[], 
          gameState.communityCards
        );
        setHandName(strength);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setEquity(0);
      setHandName('');
    }
  }, [gameState.heroCards, gameState.communityCards, gameState.activeOpponents]);

  const potOdds = getPotOdds(toCall, gameState.potSize);
  const advice = getAdvice(equity, potOdds);

  const handleCardClick = (type: 'hero' | 'community', index: number) => {
    setSelectionTarget({ type, index });
    setSelectorOpen(true);
  };

  const handleCardSelect = (card: Card) => {
    if (!selectionTarget) return;

    if (selectionTarget.type === 'hero') {
      const newHero = [...gameState.heroCards];
      newHero[selectionTarget.index] = card;
      onUpdateState({ heroCards: newHero as [Card | null, Card | null] });
    } else {
      const newCommunity = [...gameState.communityCards];
      // If adding a card to a new slot
      if (selectionTarget.index >= newCommunity.length) {
        newCommunity.push(card);
      } else {
        newCommunity[selectionTarget.index] = card;
      }
      onUpdateState({ communityCards: newCommunity });
    }
    setSelectorOpen(false);
    setSelectionTarget(null);
  };


  return (
    <div className="flex flex-col h-screen bg-poker-bg text-poker-text overflow-hidden relative">
      
      {/* HUD Section */}
      <div className="flex-none p-4 bg-gray-900 border-b border-gray-800 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded">
          <span className="text-xs text-poker-muted uppercase">Win Equity</span>
          <span className="text-2xl font-mono font-bold text-poker-gold">{equity.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded border border-gray-700">
          <span className="text-xs text-poker-muted uppercase">Advice</span>
          <span className={classNames("text-xl font-black tracking-wider", advice.color)}>
            {advice.action}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded">
          <span className="text-xs text-poker-muted uppercase">Pot Odds</span>
          <span className="text-2xl font-mono font-bold text-blue-400">{potOdds.toFixed(1)}%</span>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex-none px-4 py-2 bg-black flex justify-between items-center text-xs text-gray-400">
        <span>{handName || 'Waiting for cards...'}</span>
        <span>{gameState.activeOpponents} Opponents</span>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-4 relative">
        
        {/* Community Cards */}
        <div className="w-full">
          <div className="text-center text-poker-muted text-sm mb-2">COMMUNITY</div>
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <CardDisplay 
                key={i} 
                card={gameState.communityCards[i] || null} 
                onClick={() => handleCardClick('community', i)}
                placeholder={i < 3 ? 'Flop' : i === 3 ? 'Turn' : 'River'}
                size="md"
              />
            ))}
          </div>
        </div>

        {/* Pot & Call Input */}
        <div className="flex gap-4 w-full max-w-sm">
           <div className="flex-1 bg-gray-800 rounded p-2 flex flex-col">
              <label className="text-xs text-poker-muted flex items-center gap-1"><DollarSign size={12}/> Pot Size</label>
              <input 
                type="number" 
                value={gameState.potSize}
                onChange={(e) => onUpdateState({ potSize: Number(e.target.value) })}
                className="bg-transparent text-xl font-mono text-poker-gold focus:outline-none w-full"
              />
           </div>
           <div className="flex-1 bg-gray-800 rounded p-2 flex flex-col">
              <label className="text-xs text-poker-muted flex items-center gap-1">To Call</label>
              <input 
                type="number" 
                value={toCall}
                onChange={(e) => setToCall(Number(e.target.value))}
                className="bg-transparent text-xl font-mono text-white focus:outline-none w-full"
              />
           </div>
        </div>

      </div>

      {/* Bottom Controls (Hero) */}
      <div className="flex-none bg-poker-surface p-4 pb-8 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-10">
        <div className="flex justify-between items-end max-w-lg mx-auto">
          
          {/* Hero Cards */}
          <div className="flex gap-2">
             <CardDisplay 
               card={gameState.heroCards[0]} 
               size="lg" 
               onClick={() => handleCardClick('hero', 0)}
               highlight
             />
             <CardDisplay 
               card={gameState.heroCards[1]} 
               size="lg" 
               onClick={() => handleCardClick('hero', 1)}
               highlight
             />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <button 
                  onClick={() => onUpdateState({ activeOpponents: Math.max(1, gameState.activeOpponents - 1) })}
                  className="bg-gray-700 p-2 rounded text-white hover:bg-gray-600"
                >
                  - Opp
                </button>
                <button 
                   onClick={() => onUpdateState({ activeOpponents: Math.min(8, gameState.activeOpponents + 1) })}
                   className="bg-gray-700 p-2 rounded text-white hover:bg-gray-600"
                >
                  + Opp
                </button>
            </div>
            <button 
              onClick={onReset}
              className="flex items-center gap-2 bg-poker-red text-white px-4 py-3 rounded font-bold hover:bg-red-600 transition-colors"
            >
              <RotateCcw size={18} /> New Hand
            </button>
          </div>
          
        </div>
      </div>

      {/* Modals */}
      {selectorOpen && (
        <CardSelector 
          onSelect={handleCardSelect} 
          onCancel={() => setSelectorOpen(false)} 
        />
      )}
    </div>
  );
};
