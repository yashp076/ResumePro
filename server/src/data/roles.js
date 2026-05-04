export const roleLibrary = [
  {
    category: 'Engineering',
    roles: [
      { title: 'Software Engineer', keywords: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'testing', 'system design'] },
      { title: 'Data Engineer', keywords: ['ETL', 'SQL', 'Python', 'Spark', 'data pipelines', 'warehousing'] },
      { title: 'DevOps Engineer', keywords: ['CI/CD', 'Docker', 'Kubernetes', 'AWS', 'monitoring', 'IaC'] },
      { title: 'QA Engineer', keywords: ['test automation', 'Selenium', 'Playwright', 'regression', 'defect tracking', 'CI'] },
      { title: 'Machine Learning Engineer', keywords: ['Python', 'model training', 'MLOps', 'feature engineering', 'TensorFlow', 'evaluation'] }
    ]
  },
  {
    category: 'Design',
    roles: [
      { title: 'UI/UX Designer', keywords: ['user research', 'wireframes', 'prototypes', 'Figma', 'usability testing', 'design systems'] },
      { title: 'Graphic Designer', keywords: ['brand identity', 'Adobe Creative Suite', 'layout', 'typography', 'campaigns', 'visual systems'] },
      { title: 'Product Designer', keywords: ['product strategy', 'journey maps', 'interaction design', 'accessibility', 'experimentation', 'handoff'] }
    ]
  },
  {
    category: 'Business',
    roles: [
      { title: 'Product Manager', keywords: ['roadmap', 'stakeholders', 'prioritization', 'metrics', 'discovery', 'go-to-market'] },
      { title: 'Business Analyst', keywords: ['requirements', 'process mapping', 'SQL', 'dashboards', 'stakeholder management', 'UAT'] },
      { title: 'Operations Manager', keywords: ['process improvement', 'SOPs', 'vendor management', 'KPIs', 'forecasting', 'cost reduction'] },
      { title: 'Strategy Analyst', keywords: ['market research', 'financial modeling', 'competitive analysis', 'executive presentations', 'growth', 'planning'] }
    ]
  },
  {
    category: 'Marketing',
    roles: [
      { title: 'Digital Marketing Manager', keywords: ['paid media', 'conversion rate', 'analytics', 'campaign strategy', 'SEO', 'retargeting'] },
      { title: 'Content Marketer', keywords: ['editorial calendar', 'copywriting', 'SEO', 'brand voice', 'distribution', 'engagement'] },
      { title: 'SEO Specialist', keywords: ['keyword research', 'technical SEO', 'rank tracking', 'backlinks', 'content optimization', 'GA4'] },
      { title: 'Growth Marketer', keywords: ['experimentation', 'funnels', 'activation', 'retention', 'A/B testing', 'lifecycle'] }
    ]
  },
  {
    category: 'Finance',
    roles: [
      { title: 'Financial Analyst', keywords: ['forecasting', 'variance analysis', 'Excel', 'financial modeling', 'budgeting', 'reporting'] },
      { title: 'Accountant', keywords: ['reconciliation', 'month-end close', 'GAAP', 'accounts payable', 'audit support', 'tax'] },
      { title: 'Venture Capital Analyst', keywords: ['deal sourcing', 'due diligence', 'market sizing', 'investment memo', 'portfolio support', 'valuation'] }
    ]
  },
  {
    category: 'Healthcare',
    roles: [
      { title: 'Registered Nurse', keywords: ['patient care', 'EMR', 'care plans', 'triage', 'medication administration', 'patient education'] },
      { title: 'Doctor', keywords: ['diagnosis', 'treatment plans', 'clinical documentation', 'patient outcomes', 'rounds', 'medical research'] },
      { title: 'Healthcare Administrator', keywords: ['compliance', 'patient scheduling', 'revenue cycle', 'HIPAA', 'staff coordination', 'quality metrics'] }
    ]
  }
];

export const flatRoles = roleLibrary.flatMap((category) =>
  category.roles.map((role) => ({ ...role, category: category.category }))
);
