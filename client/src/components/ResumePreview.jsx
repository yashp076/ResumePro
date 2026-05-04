const templateClasses = {
  modern: {
    page: 'font-sans border-t-[10px] border-pine',
    header: 'border-b-4 border-pine pb-5',
    name: 'text-4xl font-bold text-ink',
    section: 'text-pine',
    skill: 'bg-pine/10 text-pine'
  },
  classic: {
    page: 'font-serif',
    header: 'border-b border-slate-400 pb-5 text-center',
    name: 'text-4xl font-normal uppercase text-ink',
    section: 'text-ink',
    skill: 'border border-slate-300 text-slate-700'
  },
  minimal: {
    page: 'font-sans',
    header: 'pb-4',
    name: 'text-3xl font-semibold text-ink',
    section: 'text-slate-500',
    skill: 'bg-slate-100 text-slate-700'
  }
};

function Section({ title, children, template }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h3 className={`mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase ${template.section}`}>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ResumePreview({ resume, previewRef }) {
  const template = templateClasses[resume.template] || templateClasses.modern;

  return (
    <article ref={previewRef} className={`resume-page mx-auto min-h-[1123px] w-[794px] bg-white p-12 text-[13px] leading-6 text-slate-700 shadow-panel ${template.page}`}>
      <header className={template.header}>
        <h1 className={template.name}>{resume.personal.name || 'Your Name'}</h1>
        <p className="mt-1 text-lg text-slate-600">{resume.personal.title}</p>
        <p className="mt-3 text-xs text-slate-500">
          {[resume.personal.email, resume.personal.phone, resume.personal.location, ...resume.personal.links].filter(Boolean).join(' | ')}
        </p>
      </header>

      {resume.summary ? (
        <Section title="Summary" template={template}>
          <p>{resume.summary}</p>
        </Section>
      ) : null}

      <Section title="Experience" template={template}>
        <div className="grid gap-4">
          {resume.experience.map((item) => (
            <div key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-ink">{item.role}</h4>
                  <p className="text-slate-600">{item.company}</p>
                </div>
                <p className="text-xs text-slate-500">{item.start} - {item.end}</p>
              </div>
              <ul className="mt-2 list-disc pl-5">
                {item.bullets.filter(Boolean).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills" template={template}>
        <div className="flex flex-wrap gap-2">
          {resume.skills.filter(Boolean).map((skill) => (
            <span key={skill} className={`rounded px-2 py-1 text-[11px] font-semibold ${template.skill}`}>
              {skill}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Projects" template={template}>
        <div className="grid gap-2">
          {resume.projects.map((project) => (
            <p key={project.id}>
              <strong className="text-ink">{project.name}:</strong> {project.description}
            </p>
          ))}
        </div>
      </Section>

      <Section title="Education" template={template}>
        {resume.education.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div>
              <strong className="text-ink">{item.degree}</strong>
              <p>{item.school}</p>
            </div>
            <span className="text-xs text-slate-500">{item.year}</span>
          </div>
        ))}
      </Section>

      {resume.certifications.length ? (
        <Section title="Certifications" template={template}>
          <p>{resume.certifications.filter(Boolean).join(' | ')}</p>
        </Section>
      ) : null}
    </article>
  );
}
