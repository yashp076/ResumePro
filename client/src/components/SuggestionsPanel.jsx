import { RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { fetchSuggestions } from '../lib/api.js';

export function SuggestionsPanel({ resume, section, onInsert, contextOverride, title = 'AI Suggestions' }) {
  const [state, setState] = useState({ loading: false, error: '', data: null });

  function buildContext() {
    const baseContext = {
      currentContent: section === 'summary' ? resume.summary : '',
      yearsOfExperience: resume.yearsOfExperience,
      industry: resume.industry
    };

    if (section !== 'summary') {
      return baseContext;
    }

    return {
      ...baseContext,
      skills: resume.skills.filter(Boolean).slice(0, 12),
      experience: resume.experience.slice(0, 3).map((item) => ({
        role: item.role,
        company: item.company,
        bullets: (item.bullets || []).filter(Boolean).slice(0, 4)
      })),
      projects: resume.projects.slice(0, 3).map((project) => ({
        name: project.name,
        description: project.description
      })),
      education: resume.education.slice(0, 2).map((item) => ({
        degree: item.degree,
        school: item.school
      })),
      certifications: resume.certifications.filter(Boolean).slice(0, 5)
    };
  }

  async function generate() {
    setState({ loading: true, error: '', data: null });
    try {
      const data = await fetchSuggestions({
        role: resume.customRole || resume.targetRole,
        section,
        context: contextOverride || buildContext()
      });
      setState({ loading: false, error: '', data });
    } catch (error) {
      setState({ loading: false, error: error.message, data: null });
    }
  }

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={generate}
          disabled={state.loading}
          type="button"
        >
          {state.loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {state.loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {state.error ? <p className="mt-3 text-sm text-rose-600">{state.error}</p> : null}

      {state.data ? (
        <div className="mt-3 space-y-2">
          {state.data.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left text-sm leading-relaxed text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
              onClick={() => onInsert(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
