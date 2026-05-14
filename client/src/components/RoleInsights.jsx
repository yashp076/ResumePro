import { BriefcaseBusiness } from 'lucide-react';

export function RoleInsights({ resume }) {
  const role = resume.customRole || resume.targetRole;

  return (
    <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Target Role</h2>
          <p className="text-xs text-slate-600">{role}{resume.industry ? ` in ${resume.industry}` : ''}</p>
        </div>
      </div>
    </section>
  );
}
