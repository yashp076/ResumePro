import { CheckCircle2, CircleAlert, Gauge } from 'lucide-react';
import { analyzeAts } from '../lib/ats.js';

export function AtsScore({ resume }) {
  const ats = analyzeAts(resume);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">ATS Score</h2>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-base font-bold text-blue-600">
          {ats.score}
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${ats.score}%` }} />
      </div>
      <div className="mt-4 space-y-3 text-xs">
        <div className="flex gap-2 rounded-lg bg-emerald-50 p-3 text-slate-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Matched: {ats.matched.length ? ats.matched.join(', ') : 'Add role-specific keywords to improve match.'}</span>
        </div>
        <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-slate-700">
          <CircleAlert className="h-4 w-4 shrink-0 text-amber-600" />
          <span>Missing: {ats.missing.length ? ats.missing.join(', ') : 'Nice coverage for this role.'}</span>
        </div>
      </div>
    </section>
  );
}
