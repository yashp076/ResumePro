const actionVerbs = [
  'built',
  'delivered',
  'improved',
  'reduced',
  'increased',
  'launched',
  'designed',
  'automated',
  'optimized',
  'led',
  'created',
  'analyzed'
];

function allBullets(resume) {
  return resume.experience.flatMap((item) => item.bullets || []).filter(Boolean);
}

export function calculateCompletion(resume) {
  const checks = [
    Boolean(resume.personal.name),
    Boolean(resume.personal.email),
    Boolean(resume.personal.phone),
    Boolean(resume.summary && resume.summary.length > 90),
    resume.experience.some((item) => item.company && item.role && item.bullets?.length),
    resume.skills.length >= 6,
    resume.projects.some((item) => item.name && item.description),
    resume.education.some((item) => item.school && item.degree)
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function analyzeQuality(resume) {
  const bullets = allBullets(resume);
  const quantified = bullets.filter((bullet) => /\d|%|revenue|users|hours|cost|time/i.test(bullet));
  const strongStarts = bullets.filter((bullet) => actionVerbs.some((verb) => bullet.toLowerCase().startsWith(verb)));
  const summaryLength = resume.summary.trim().split(/\s+/).filter(Boolean).length;
  const tips = [];

  if (summaryLength < 25) {
    tips.push('Expand the summary to show role, domain, strengths, and measurable impact.');
  }
  if (quantified.length < Math.max(1, Math.ceil(bullets.length / 2))) {
    tips.push('Add metrics to at least half of the experience bullets.');
  }
  if (strongStarts.length < bullets.length) {
    tips.push('Start more bullets with strong action verbs like Delivered, Built, Improved, or Automated.');
  }
  if (resume.skills.length < 8) {
    tips.push('Add 8-12 targeted skills for stronger scanning and ATS matching.');
  }
  if (!resume.projects.length) {
    tips.push('Add one project that proves practical experience for the target role.');
  }

  const score = Math.round((
    Math.min(summaryLength / 35, 1) * 25
    + (bullets.length ? quantified.length / bullets.length : 0) * 30
    + (bullets.length ? strongStarts.length / bullets.length : 0) * 25
    + Math.min(resume.skills.length / 10, 1) * 20
  ));

  return {
    score,
    quantified: quantified.length,
    bulletCount: bullets.length,
    strongStarts: strongStarts.length,
    tips: tips.slice(0, 4)
  };
}
