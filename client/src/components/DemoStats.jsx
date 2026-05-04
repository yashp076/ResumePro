import { Clock3, DatabaseZap, FileCheck2, Sparkles } from 'lucide-react';
import { calculateCompletion } from '../lib/resumeQuality.js';

export function DemoStats({ resume }) {
  const completion = calculateCompletion(resume);
  const stats = [
    { label: 'Completion', value: `${completion}%`, icon: FileCheck2, tone: 'text-pine' },
    { label: 'AI Sections', value: '3', icon: Sparkles, tone: 'text-coral' },
    { label: 'Storage', value: 'Local', icon: DatabaseZap, tone: 'text-gold' },
    { label: 'Goal Time', value: '<15m', icon: Clock3, tone: 'text-slate-700' }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="rounded-lg border border-white/70 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-slate-500">{stat.label}</p>
              <Icon className={`h-4 w-4 ${stat.tone}`} />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink">{stat.value}</p>
          </div>
        );
      })}
    </section>
  );
}
