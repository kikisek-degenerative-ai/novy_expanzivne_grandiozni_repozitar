import type { GameState } from '../simulation/types.ts';

interface GameEndOverlayProps {
  readonly state: GameState;
  readonly onRestart: () => void;
}

export function GameEndOverlay({ state, onRestart }: GameEndOverlayProps) {
  if (state.status === 'playing') {
    return null;
  }

  const isVictory = state.status === 'won';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-end-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 p-4 backdrop-blur-xs"
    >
      <section
        className={`w-full max-w-lg rounded-md border p-6 shadow-2xl ${
          isVictory
            ? 'border-emerald-600/60 bg-stone-900'
            : 'border-red-600/60 bg-stone-900'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded border px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider ${
              isVictory
                ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300'
                : 'border-red-500/50 bg-red-950/60 text-red-300'
            }`}
          >
            {isVictory ? 'Mandát obhájen' : 'Konec vlády'}
          </span>
          <span className="font-mono text-xs text-stone-400">Dosažené kolo: {state.turn}</span>
        </div>

        <h2 id="game-end-title" className="mt-4 text-2xl font-semibold tracking-tight text-stone-100">
          {isVictory ? 'Vítězství' : 'Prohra'}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-stone-300">
          {state.endReason ?? (isVictory ? 'Stát přečkal přechodové období.' : 'Vláda ztratila kontrolu nad státem.')}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded border border-stone-800 bg-stone-950/70 p-3 font-mono text-xs text-stone-300 sm:grid-cols-3">
          <div>Pokladna: {state.economics.treasury} M</div>
          <div>Inflace: {state.economics.inflation}%</div>
          <div>Nezaměstnanost: {state.economics.unemployment}%</div>
          <div>Banky: {state.economics.bankStability}%</div>
          <div>Veřejnost: {state.politics.publicApproval}%</div>
          <div>Aparát: {state.politics.factionLoyalty}%</div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onRestart}
            className="rounded border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
          >
            Začít novou hru
          </button>
        </div>
      </section>
    </div>
  );
}
