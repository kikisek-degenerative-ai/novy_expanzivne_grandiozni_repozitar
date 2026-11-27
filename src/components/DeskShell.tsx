import { GameEndOverlay } from './GameEndOverlay.tsx';
import { PolicyDocumentCard } from './PolicyDocumentCard.tsx';
import { TopStatusBar } from './TopStatusBar.tsx';
import type { DecisionOption, GameState, PolicyDocument } from './mock-desk-engine.ts';

interface DeskShellProps {
  readonly state: GameState;
  readonly targetTurns: number;
  readonly currentDocument: PolicyDocument;
  readonly selectedOption: DecisionOption | null;
  readonly lastTurnSummary: string | null;
  readonly onSelectOption: (option: DecisionOption) => void;
  readonly onAdvanceTurn: () => void;
  readonly onRestart: () => void;
}

export function DeskShell({
  state,
  targetTurns,
  currentDocument,
  selectedOption,
  lastTurnSummary,
  onSelectOption,
  onAdvanceTurn,
  onRestart,
}: DeskShellProps) {
  const isPlaying = state.status === 'playing';

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <TopStatusBar
        state={state}
        targetTurns={targetTurns}
        previewDelta={selectedOption?.effects}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-5 px-4 py-6 sm:px-6">
        {lastTurnSummary && (
          <div className="rounded border border-stone-800 bg-stone-900/70 px-4 py-3 text-xs text-stone-300">
            <span className="font-mono uppercase tracking-wider text-stone-400">Hlášení: </span>
            {lastTurnSummary}
          </div>
        )}

        <PolicyDocumentCard
          document={currentDocument}
          selectedOptionId={selectedOption?.id ?? null}
          onSelectOption={onSelectOption}
          disabled={!isPlaying}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-stone-800 bg-stone-900/80 px-5 py-4">
          <div className="text-xs text-stone-400">
            {selectedOption ? (
              <span>
                Připraveno k podpisu:{' '}
                <strong className="font-medium text-stone-200">{selectedOption.label}</strong>
              </span>
            ) : (
              'Vyberte jedno z rozhodnutí na spisu pro posun do dalšího kola.'
            )}
          </div>

          <button
            type="button"
            disabled={!isPlaying || !selectedOption}
            onClick={onAdvanceTurn}
            className="rounded border border-amber-500 bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800 disabled:text-stone-500"
          >
            Podepsat a posunout kolo
          </button>
        </div>
      </main>

      <GameEndOverlay state={state} onRestart={onRestart} />
    </div>
  );
}
