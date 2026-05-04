import { BadgeCheck, Lightbulb, TrendingUp } from 'lucide-react';
import { analyzeQuality } from '../lib/resumeQuality.js';

export function QualityPanel({ resume }) {
  const quality = analyzeQuality(resume);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">Content Quality</h2>
        </div>
        <div className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-bold text-white">{quality.score}/100</div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-rose-500" />
            <span className="font-medium text-slate-700">Quantified</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{quality.quantified}/{quality.bulletCount}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-slate-700">Strong starts</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{quality.strongStarts}/{quality.bulletCount}</p>
        </div>
      </div>

      <div className="space-y-2">
        {quality.tips.length ? quality.tips.map((tip) => (
          <div key={tip} className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-slate-700">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>{tip}</span>
          </div>
        )) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
            Resume content looks excellent.
          </div>
        )}
      </div>
    </section>
  );
}
