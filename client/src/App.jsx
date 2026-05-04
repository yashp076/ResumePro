import { Download, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AtsScore } from './components/AtsScore.jsx';
import { QualityPanel } from './components/QualityPanel.jsx';
import { ResumeForm } from './components/ResumeForm.jsx';
import { ResumePreview } from './components/ResumePreview.jsx';
import { RoleInsights } from './components/RoleInsights.jsx';
import { fallbackRoleCategories } from './data/roles.js';
import { useResume } from './context/ResumeContext.jsx';
import { fetchRoles } from './lib/api.js';
import { exportResumePdf } from './lib/pdf.js';

export default function App() {
  const { resume, update } = useResume();
  const [roleCategories, setRoleCategories] = useState(fallbackRoleCategories);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    fetchRoles()
      .then((data) => setRoleCategories(data.categories))
      .catch(() => setRoleCategories(fallbackRoleCategories));
  }, []);

  function exportJson() {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${resume.personal.name || 'resume'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handlePdf() {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await exportResumePdf(previewRef.current, `${resume.personal.name || 'resume'}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ResumePro</h1>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value={resume.template} onChange={(event) => update('template', event.target.value)} aria-label="Template">
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50" type="button" onClick={handlePdf} disabled={exporting}>
              <Download className="h-4 w-4" />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-6 py-6 xl:grid-cols-[420px_1fr]">
        <aside className="space-y-6">
          <ResumeForm roleCategories={roleCategories} onExportJson={exportJson} />
        </aside>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AtsScore resume={resume} />
            <QualityPanel resume={resume} />
          </div>

          <RoleInsights resume={resume} />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ResumePreview resume={resume} previewRef={previewRef} />
          </div>
        </div>
      </div>
    </main>
  );
}
