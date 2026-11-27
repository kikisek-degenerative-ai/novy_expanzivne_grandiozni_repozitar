import { useState } from 'react';
import { DeskShell } from './components/DeskShell.tsx';
import { documents } from './data/documents.ts';
import { advanceTurn } from './simulation/advance-turn.ts';
import { FINAL_TURN } from './simulation/constants.ts';
import { createInitialState } from './simulation/initial-state.ts';
import type { DecisionOption, GameState } from './simulation/types.ts';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [lastTurnSummary, setLastTurnSummary] = useState<string | null>(null);

  const currentDocument =
    documents.find((doc) => !gameState.resolvedDocumentIds.includes(doc.id)) ??
    documents[(gameState.turn - 1) % documents.length];

  function handleAdvanceTurn() {
    if (!selectedOption || gameState.status !== 'playing') {
      return;
    }

    const result = advanceTurn(gameState, [selectedOption]);
    setGameState(result.nextState);
    setLastTurnSummary(result.summary);
    setSelectedOption(null);
  }

  function handleRestart() {
    setGameState(createInitialState());
    setSelectedOption(null);
    setLastTurnSummary(null);
  }

  return (
    <DeskShell
      state={gameState}
      targetTurns={FINAL_TURN}
      currentDocument={currentDocument}
      selectedOption={selectedOption}
      lastTurnSummary={lastTurnSummary}
      onSelectOption={setSelectedOption}
      onAdvanceTurn={handleAdvanceTurn}
      onRestart={handleRestart}
    />
  );
}
