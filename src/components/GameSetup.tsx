import React from 'react';
import { GameState, POSITIONS, PlayerPosition } from '../types';

interface GameSetupProps {
  onSetupComplete: (settings: Partial<GameState>) => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onSetupComplete }) => {
  const [numPlayers, setNumPlayers] = React.useState(9);
  const [userPosition, setUserPosition] = React.useState<PlayerPosition>('BTN');
  const [bigBlindAmount, setBigBlindAmount] = React.useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetupComplete({
      numPlayers,
      userPosition,
      bigBlindAmount,
      activeOpponents: numPlayers - 1, // Default to everyone in
      heroCards: [null, null],
      communityCards: [],
      potSize: 0,
      currentStage: 'preflop'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-poker-bg text-poker-text p-4">
      <h1 className="text-3xl font-bold mb-8 text-poker-gold">TABLE SETUP</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-poker-surface p-6 rounded-lg shadow-xl border border-gray-800">
        
        {/* Number of Players */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-poker-muted">Number of Players</label>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setNumPlayers(num)}
                className={`w-10 h-10 rounded-full font-mono font-bold transition-colors ${
                  numPlayers === num 
                    ? 'bg-poker-gold text-black' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* User Position */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-poker-muted">Your Position</label>
          <select 
            value={userPosition}
            onChange={(e) => setUserPosition(e.target.value as PlayerPosition)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-poker-green focus:outline-none"
          >
            {POSITIONS.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        {/* Big Blind Amount */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-poker-muted">Big Blind Amount ($)</label>
          <input
            type="number"
            value={bigBlindAmount}
            onChange={(e) => setBigBlindAmount(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 text-white font-mono rounded-md p-3 focus:ring-2 focus:ring-poker-green focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-poker-green text-black font-bold py-4 rounded-md text-lg hover:bg-green-400 transition-colors uppercase tracking-wider"
        >
          Start Session
        </button>
      </form>
    </div>
  );
};
