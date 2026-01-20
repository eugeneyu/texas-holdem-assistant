import React, { useState } from 'react';
import { Card, Rank, Suit } from '../types';
import classNames from 'classnames';

interface CardSelectorProps {
  onSelect: (card: Card) => void;
  onCancel: () => void;
}

const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS: { suit: Suit; label: string; color: string }[] = [
  { suit: 's', label: '♠', color: 'text-gray-200' },
  { suit: 'h', label: '♥', color: 'text-red-500' },
  { suit: 'c', label: '♣', color: 'text-green-500' },
  { suit: 'd', label: '♦', color: 'text-blue-400' }, // Using blue for diamonds to distinguish from hearts in dark mode, or standard red
];

export const CardSelector: React.FC<CardSelectorProps> = ({ onSelect, onCancel }) => {
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);

  const handleRankClick = (rank: Rank) => {
    setSelectedRank(rank);
  };

  const handleSuitClick = (suit: Suit) => {
    if (selectedRank) {
      onSelect({ rank: selectedRank, suit });
      setSelectedRank(null); // Reset for next selection if component stays mounted
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-end pb-8 animate-in slide-in-from-bottom duration-200">
      
      {/* Header / Preview */}
      <div className="w-full max-w-md px-4 mb-4 flex justify-between items-center">
        <span className="text-xl font-bold text-poker-gold">
          {selectedRank ? `Select Suit for ${selectedRank}` : 'Select Rank'}
        </span>
        <button 
          onClick={onCancel}
          className="text-poker-muted hover:text-white px-4 py-2"
        >
          Cancel
        </button>
      </div>

      <div className="w-full max-w-md bg-poker-surface rounded-t-2xl p-4 shadow-2xl border-t border-gray-700">
        
        {/* Rank Grid */}
        {!selectedRank && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {RANKS.map((rank) => (
              <button
                key={rank}
                onClick={() => handleRankClick(rank)}
                className="h-14 bg-gray-800 rounded-lg text-xl font-mono font-bold hover:bg-poker-gold hover:text-black transition-colors border border-gray-700"
              >
                {rank}
              </button>
            ))}
          </div>
        )}

        {/* Suit Grid (Only shown after rank is selected) */}
        {selectedRank && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            {SUITS.map(({ suit, label, color }) => (
              <button
                key={suit}
                onClick={() => handleSuitClick(suit)}
                className={classNames(
                  "h-20 bg-gray-800 rounded-lg text-4xl flex items-center justify-center hover:bg-gray-700 border border-gray-700 transition-colors",
                  color === 'text-red-500' ? 'text-red-500' : 
                  color === 'text-blue-400' ? 'text-blue-400' : 
                  color === 'text-green-500' ? 'text-green-500' : 'text-gray-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        
        {selectedRank && (
           <button 
             onClick={() => setSelectedRank(null)}
             className="w-full py-3 mt-2 text-sm text-poker-muted uppercase tracking-wide border border-gray-700 rounded"
           >
             Back to Ranks
           </button>
        )}

      </div>
    </div>
  );
};
