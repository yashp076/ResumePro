const roleKeywords = {
  'Software Engineer': ['React', 'Node.js', 'REST APIs', 'testing', 'JavaScript', 'system design'],
  'Data Engineer': ['ETL', 'SQL', 'Python', 'Spark', 'pipelines', 'warehousing'],
  'DevOps Engineer': ['CI/CD', 'Docker', 'Kubernetes', 'AWS', 'monitoring', 'IaC'],
  'Product Manager': ['roadmap', 'stakeholders', 'prioritization', 'metrics', 'discovery', 'go-to-market'],
  'UI/UX Designer': ['user research', 'wireframes', 'prototypes', 'Figma', 'usability testing', 'design systems'],
  'Financial Analyst': ['forecasting', 'variance analysis', 'Excel', 'financial modeling', 'budgeting', 'reporting']
};

export function analyzeAts(resume) {
  const role = resume.customRole || resume.targetRole;
  const keywords = roleKeywords[role] || ['leadership', 'communication', 'analysis', 'collaboration', 'delivery', 'impact'];
  const text = JSON.stringify(resume).toLowerCase();
  const matched = keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
  const missing = keywords.filter((keyword) => !matched.includes(keyword));
  const score = Math.round((matched.length / keywords.length) * 100);

  return {
    score,
    matched,
    missing,
    keywords
  };
}
