import { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { Dashboard } from './components/Dashboard';
import { GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleSetupComplete = (settings: Partial<GameState>) => {
    // Ensure we have a valid initial state
    const initialState: GameState = {
      numPlayers: settings.numPlayers || 9,
      userPosition: settings.userPosition || 'BTN',
      bigBlindAmount: settings.bigBlindAmount || 100,
      heroCards: settings.heroCards || [null, null],
      communityCards: settings.communityCards || [],
      potSize: settings.potSize || 0,
      currentStage: settings.currentStage || 'preflop',
      activeOpponents: settings.activeOpponents || (settings.numPlayers ? settings.numPlayers - 1 : 8)
    };
    setGameState(initialState);
  };

  const handleUpdateState = (updates: Partial<GameState>) => {
    if (!gameState) return;
    setGameState({ ...gameState, ...updates });
  };

  const handleReset = () => {
    if (!gameState) return;
    // Keep settings, clear hand
    setGameState({
      ...gameState,
      heroCards: [null, null],
      communityCards: [],
      potSize: 0,
      currentStage: 'preflop',
      activeOpponents: gameState.numPlayers - 1
    });
  };

  if (!gameState) {
    return <GameSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <Dashboard 
      gameState={gameState} 
      onUpdateState={handleUpdateState} 
      onReset={handleReset} 
    />
  );
}

export default App;
