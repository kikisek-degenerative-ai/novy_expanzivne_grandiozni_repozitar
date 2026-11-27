import type { DecisionOption, IndicatorDelta, PolicyDocument } from '../simulation/types.ts';

interface PolicyDocumentCardProps {
  readonly document: PolicyDocument;
  readonly selectedOptionId: string | null;
  readonly onSelectOption: (option: DecisionOption) => void;
  readonly disabled?: boolean;
}

interface EffectMeta {
  readonly key: keyof IndicatorDelta;
  readonly label: string;
  readonly unit: string;
  readonly higherIsBetter: boolean;
}

const EFFECT_METADATA: readonly EffectMeta[] = [
  { key: 'treasury', label: 'Pokladna', unit: ' M', higherIsBetter: true },
  { key: 'inflation', label: 'Inflace', unit: '%', higherIsBetter: false },
  { key: 'unemployment', label: 'Nezaměstnanost', unit: '%', higherIsBetter: false },
  { key: 'bankStability', label: 'Banky', unit: '%', higherIsBetter: true },
  { key: 'publicApproval', label: 'Veřejnost', unit: '%', higherIsBetter: true },
  { key: 'factionLoyalty', label: 'Aparát', unit: '%', higherIsBetter: true },
];

function formatEffects(effects: IndicatorDelta) {
  return EFFECT_METADATA.flatMap((meta) => {
    const val = effects[meta.key];
    if (val === undefined || val === 0) return [];
    const isPositiveImpact = meta.higherIsBetter ? val > 0 : val < 0;
    return [
      {
        key: meta.key,
        text: `${meta.label} ${val > 0 ? `+${val}` : val}${meta.unit}`,
        isPositiveImpact,
      },
    ];
  });
}

export function PolicyDocumentCard({
  document,
  selectedOptionId,
  onSelectOption,
  disabled = false,
}: PolicyDocumentCardProps) {
  return (
    <article className="rounded-md border border-stone-700/90 bg-stone-900 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 bg-stone-950/60 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="rounded border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-amber-300">
            Příchozí spis
          </span>
          <span className="font-mono text-xs text-stone-400">#{document.id}</span>
        </div>
        <div className="text-xs text-stone-300">
          Odesílatel: <span className="font-medium text-stone-100">{document.sender}</span>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-100">{document.title}</h2>
          <p className="mt-2.5 text-sm leading-relaxed text-stone-300">{document.description}</p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400">
            Možnosti rozhodnutí ({document.options.length})
          </div>

          <div className="space-y-2.5">
            {document.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const effectBadges = formatEffects(option.effects);

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectOption(option)}
                  className={`w-full rounded border p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400/50'
                      : 'border-stone-700/80 bg-stone-950/60 hover:border-stone-500 hover:bg-stone-800/60'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-stone-100">{option.label}</div>
                      <p className="mt-1 text-xs leading-relaxed text-stone-400">{option.summary}</p>
                    </div>
                    <span
                      className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                          : 'border-stone-700 text-stone-400'
                      }`}
                    >
                      {isSelected ? 'Vybráno' : 'Zvolit'}
                    </span>
                  </div>

                  {effectBadges.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {effectBadges.map((badge) => (
                        <span
                          key={badge.key}
                          className={`rounded border px-2 py-0.5 font-mono text-[11px] ${
                            badge.isPositiveImpact
                              ? 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300'
                              : 'border-rose-700/60 bg-rose-950/40 text-rose-300'
                          }`}
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
