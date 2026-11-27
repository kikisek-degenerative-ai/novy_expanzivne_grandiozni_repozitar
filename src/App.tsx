import { useState } from 'react';
import { DeskShell } from './components/DeskShell.tsx';
import {
  INITIAL_GAME_STATE,
  TARGET_SURVIVAL_TURNS,
  getDocumentForTurn,
  mockAdvanceTurn,
  type DecisionOption,
  type GameState,
} from './components/mock-desk-engine.ts';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [lastTurnSummary, setLastTurnSummary] = useState<string | null>(null);

  const currentDocument = getDocumentForTurn(gameState.turn);

  function handleAdvanceTurn() {
    if (!selectedOption || gameState.status !== 'playing') {
      return;
    }

    // TODO(Track A integration): Replace mockAdvanceTurn with advanceTurn from src/simulation/
    const result = mockAdvanceTurn(gameState, [selectedOption], currentDocument.id);
    setGameState(result.nextState);
    setLastTurnSummary(result.summary);
    setSelectedOption(null);
  }

  function handleRestart() {
    setGameState(INITIAL_GAME_STATE);
    setSelectedOption(null);
    setLastTurnSummary(null);
  }

  return (
    <DeskShell
      state={gameState}
      targetTurns={TARGET_SURVIVAL_TURNS}
      currentDocument={currentDocument}
      selectedOption={selectedOption}
      lastTurnSummary={lastTurnSummary}
      onSelectOption={setSelectedOption}
      onAdvanceTurn={handleAdvanceTurn}
      onRestart={handleRestart}
    />
  );
}
