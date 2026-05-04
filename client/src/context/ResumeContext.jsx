import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultResume } from '../data/defaultResume.js';
import { clearResume, loadResume, saveResume } from '../lib/storage.js';

const ResumeContext = createContext(null);

function freshResume() {
  return JSON.parse(JSON.stringify(defaultResume));
}

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => loadResume() || freshResume());

  useEffect(() => {
    saveResume(resume);
  }, [resume]);

  const value = useMemo(() => ({
    resume,
    setResume,
    update(path, valueOrUpdater) {
      setResume((current) => {
        const next = structuredClone(current);
        const parts = path.split('.');
        let cursor = next;
        for (let index = 0; index < parts.length - 1; index += 1) {
          cursor = cursor[parts[index]];
        }
        const key = parts.at(-1);
        cursor[key] = typeof valueOrUpdater === 'function'
          ? valueOrUpdater(cursor[key])
          : valueOrUpdater;
        return next;
      });
    },
    reset() {
      clearResume();
      setResume(freshResume());
    },
    importResume(data) {
      setResume({
        ...freshResume(),
        ...data,
        personal: { ...freshResume().personal, ...(data.personal || {}) }
      });
    }
  }), [resume]);

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used inside ResumeProvider');
  }
  return context;
}
