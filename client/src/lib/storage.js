const STORAGE_KEY = 'ai-resume-builder:data';

export function loadResume() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveResume(resume) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
}

export function clearResume() {
  localStorage.removeItem(STORAGE_KEY);
}
