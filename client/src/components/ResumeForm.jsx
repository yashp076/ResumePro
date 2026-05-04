import { Download, FilePlus2, RotateCcw, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { Field, inputClass, textareaClass } from './Field.jsx';
import { SuggestionsPanel } from './SuggestionsPanel.jsx';
import { useResume } from '../context/ResumeContext.jsx';

function splitLines(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function joinLines(value) {
  return value.join('\n');
}

export function ResumeForm({ roleCategories, onExportJson }) {
  const { resume, update, reset, importResume } = useResume();
  const fileInputRef = useRef(null);

  function updateList(path, index, value) {
    update(path, (items) => items.map((item, itemIndex) => itemIndex === index ? value : item));
  }

  function addExperience() {
    update('experience', (items) => [...items, {
      id: crypto.randomUUID(),
      company: '',
      role: '',
      start: '',
      end: '',
      bullets: ['']
    }]);
  }

  function removeExperience(id) {
    update('experience', (items) => items.filter((item) => item.id !== id));
  }

  function addProject() {
    update('projects', (items) => [...items, { id: crypto.randomUUID(), name: '', description: '' }]);
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importResume(JSON.parse(reader.result));
      } catch {
        alert('This JSON file could not be imported.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Resume Details</h2>
          <div className="flex gap-2">
            <button type="button" className="icon-button" onClick={onExportJson} title="Export JSON">
              <Download className="h-4 w-4" />
            </button>
            <button type="button" className="icon-button" onClick={() => fileInputRef.current?.click()} title="Import JSON">
              <Upload className="h-4 w-4" />
            </button>
            <button type="button" className="icon-button" onClick={reset} title="Reset resume">
              <RotateCcw className="h-4 w-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Target role">
            <select className={inputClass} value={resume.targetRole} onChange={(event) => update('targetRole', event.target.value)}>
              {roleCategories.map((category) => (
                <optgroup key={category.category} label={category.category}>
                  {category.roles.map((role) => {
                    const title = typeof role === 'string' ? role : role.title;
                    return <option key={title} value={title}>{title}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Custom role">
            <input className={inputClass} value={resume.customRole} onChange={(event) => update('customRole', event.target.value)} placeholder="Optional override" />
          </Field>
          <Field label="Years of experience">
            <input className={inputClass} type="number" min="0" value={resume.yearsOfExperience} onChange={(event) => update('yearsOfExperience', Number(event.target.value))} />
          </Field>
          <Field label="Industry">
            <input className={inputClass} value={resume.industry} onChange={(event) => update('industry', event.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Personal Information</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {['name', 'title', 'email', 'phone', 'location'].map((field) => (
            <Field key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
              <input className={inputClass} value={resume.personal[field]} onChange={(event) => update(`personal.${field}`, event.target.value)} />
            </Field>
          ))}
          <Field label="Links">
            <textarea className={textareaClass} value={joinLines(resume.personal.links)} onChange={(event) => update('personal.links', splitLines(event.target.value))} />
          </Field>
        </div>
      </section>

      <SuggestionsPanel resume={resume} section="summary" onInsert={(suggestion) => update('summary', suggestion)} />
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <Field label="Professional Summary">
          <textarea className={textareaClass} value={resume.summary} onChange={(event) => update('summary', event.target.value)} />
        </Field>
      </section>

      <SuggestionsPanel resume={resume} section="experience" onInsert={(suggestion) => {
        update('experience', (items) => {
          const next = [...items];
          next[0] = { ...next[0], bullets: [...next[0].bullets, suggestion] };
          return next;
        });
      }} />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Experience</h2>
          <button type="button" className="text-button" onClick={addExperience}><FilePlus2 className="h-4 w-4" /> Add</button>
        </div>
        <div className="grid gap-4">
          {resume.experience.map((item, index) => (
            <div key={item.id} className="rounded-md border border-slate-200 p-3">
              <div className="mb-3 flex justify-end">
                <button type="button" className="icon-button" onClick={() => removeExperience(item.id)} title="Remove experience">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Company">
                  <input className={inputClass} value={item.company} onChange={(event) => updateList('experience', index, { ...item, company: event.target.value })} />
                </Field>
                <Field label="Role">
                  <input className={inputClass} value={item.role} onChange={(event) => updateList('experience', index, { ...item, role: event.target.value })} />
                </Field>
                <Field label="Start">
                  <input className={inputClass} value={item.start} onChange={(event) => updateList('experience', index, { ...item, start: event.target.value })} />
                </Field>
                <Field label="End">
                  <input className={inputClass} value={item.end} onChange={(event) => updateList('experience', index, { ...item, end: event.target.value })} />
                </Field>
              </div>
              <Field label="Bullets">
                <textarea className={textareaClass} value={joinLines(item.bullets)} onChange={(event) => updateList('experience', index, { ...item, bullets: splitLines(event.target.value) })} />
              </Field>
            </div>
          ))}
        </div>
      </section>

      <SuggestionsPanel resume={resume} section="skills" onInsert={(suggestion) => update('skills', (items) => [...new Set([...items, suggestion])])} />

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <Field label="Skills">
          <textarea className={textareaClass} value={joinLines(resume.skills)} onChange={(event) => update('skills', splitLines(event.target.value))} />
        </Field>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Projects</h2>
          <button type="button" className="text-button" onClick={addProject}><FilePlus2 className="h-4 w-4" /> Add</button>
        </div>
        <div className="grid gap-3">
          {resume.projects.map((project, index) => (
            <div key={project.id} className="grid gap-3 rounded-md border border-slate-200 p-3">
              <Field label="Project name">
                <input className={inputClass} value={project.name} onChange={(event) => updateList('projects', index, { ...project, name: event.target.value })} />
              </Field>
              <Field label="Description">
                <textarea className={textareaClass} value={project.description} onChange={(event) => updateList('projects', index, { ...project, description: event.target.value })} />
              </Field>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <Field label="Education">
          <textarea
            className={textareaClass}
            value={resume.education.map((item) => `${item.degree} | ${item.school} | ${item.year}`).join('\n')}
            onChange={(event) => update('education', splitLines(event.target.value).map((line) => {
              const [degree = '', school = '', year = ''] = line.split('|').map((part) => part.trim());
              return { id: crypto.randomUUID(), degree, school, year };
            }))}
          />
        </Field>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <Field label="Certifications">
          <textarea className={textareaClass} value={joinLines(resume.certifications)} onChange={(event) => update('certifications', splitLines(event.target.value))} />
        </Field>
      </section>
    </div>
  );
}
