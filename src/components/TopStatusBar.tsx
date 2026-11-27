import type { GameState, IndicatorDelta } from '../simulation/types.ts';

interface TopStatusBarProps {
  readonly state: GameState;
  readonly targetTurns: number;
  readonly previewDelta?: IndicatorDelta;
}

interface IndicatorTileProps {
  readonly label: string;
  readonly value: number;
  readonly unit: string;
  readonly delta?: number;
  readonly tone: 'normal' | 'warning' | 'danger';
  readonly higherIsBetter: boolean;
}

function getTone(value: number, lowDanger: number, lowWarn: number, inverted = false): 'normal' | 'warning' | 'danger' {
  if (inverted) {
    if (value >= lowDanger) return 'danger';
    if (value >= lowWarn) return 'warning';
    return 'normal';
  }
  if (value <= lowDanger) return 'danger';
  if (value <= lowWarn) return 'warning';
  return 'normal';
}

function IndicatorTile({ label, value, unit, delta, tone, higherIsBetter }: IndicatorTileProps) {
  const toneBorder =
    tone === 'danger'
      ? 'border-red-500/60 bg-red-950/30'
      : tone === 'warning'
        ? 'border-amber-500/50 bg-amber-950/20'
        : 'border-stone-800 bg-stone-900/80';

  const toneValue =
    tone === 'danger' ? 'text-red-300' : tone === 'warning' ? 'text-amber-200' : 'text-stone-100';

  const hasDelta = delta !== undefined && delta !== 0;
  const isPositiveImpact = hasDelta && (higherIsBetter ? delta > 0 : delta < 0);
  const deltaClass = isPositiveImpact ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className={`rounded border px-3 py-2 ${toneBorder}`}>
      <div className="text-[11px] uppercase tracking-wider text-stone-400">{label}</div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className={`font-mono text-lg font-semibold ${toneValue}`}>
          {value}
          {unit}
        </span>
        {hasDelta && (
          <span className={`font-mono text-xs font-medium ${deltaClass}`}>
            {delta > 0 ? `+${delta}` : delta}
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function TopStatusBar({ state, targetTurns, previewDelta }: TopStatusBarProps) {
  const { economics, politics, turn } = state;
  const year = 1981 + Math.floor((turn - 1) / 4);
  const quarter = ((turn - 1) % 4) + 1;

  return (
    <header className="border-b border-stone-800 bg-stone-950/95 px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400/80">
              Úřad hlavy státu · Přechodová vláda
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-stone-100 sm:text-xl">
              Pracovna hlavy státu
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded border border-stone-700 bg-stone-900 px-3 py-1.5 text-right font-mono">
              <div className="text-[10px] uppercase tracking-wider text-stone-400">Období</div>
              <div className="text-sm font-semibold text-amber-200">
                Kolo {turn} / {targetTurns} · Q{quarter} {year}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          <IndicatorTile
            label="Pokladna"
            value={economics.treasury}
            unit=" M"
            delta={previewDelta?.treasury}
            tone={getTone(economics.treasury, 25, 50)}
            higherIsBetter={true}
          />
          <IndicatorTile
            label="Inflace"
            value={economics.inflation}
            unit="%"
            delta={previewDelta?.inflation}
            tone={getTone(economics.inflation, 35, 22, true)}
            higherIsBetter={false}
          />
          <IndicatorTile
            label="Nezaměstnanost"
            value={economics.unemployment}
            unit="%"
            delta={previewDelta?.unemployment}
            tone={getTone(economics.unemployment, 25, 16, true)}
            higherIsBetter={false}
          />
          <IndicatorTile
            label="Stabilita bank"
            value={economics.bankStability}
            unit="%"
            delta={previewDelta?.bankStability}
            tone={getTone(economics.bankStability, 25, 45)}
            higherIsBetter={true}
          />
          <IndicatorTile
            label="Veřejné mínění"
            value={politics.publicApproval}
            unit="%"
            delta={previewDelta?.publicApproval}
            tone={getTone(politics.publicApproval, 25, 40)}
            higherIsBetter={true}
          />
          <IndicatorTile
            label="Loajalita aparátu"
            value={politics.factionLoyalty}
            unit="%"
            delta={previewDelta?.factionLoyalty}
            tone={getTone(politics.factionLoyalty, 25, 40)}
            higherIsBetter={true}
          />
        </div>
      </div>
    </header>
  );
}
