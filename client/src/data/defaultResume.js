export const defaultResume = {
  personal: {
    name: 'Aarav Sharma',
    title: 'Software Engineer',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    links: ['linkedin.com/in/aarav', 'github.com/aarav']
  },
  summary: 'Software Engineer with 3+ years of experience building reliable web applications with React, Node.js, REST APIs, and clean API design. Strong record of improving product performance, creating reusable UI systems, and collaborating with cross-functional teams to ship measurable user impact.',
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Nova Systems',
      role: 'Frontend Developer',
      start: '2023',
      end: 'Present',
      bullets: [
        'Built reusable React components that reduced feature delivery time by 30%.',
        'Improved dashboard load performance by 42% through code splitting and API response optimization.',
        'Delivered REST API integrations with Node.js services, reducing manual reporting effort by 18 hours per month.'
      ]
    }
  ],
  education: [
    {
      id: crypto.randomUUID(),
      school: 'City Engineering College',
      degree: 'B.Tech in Computer Science',
      year: '2022'
    }
  ],
  skills: ['React', 'Node.js', 'REST APIs', 'JavaScript', 'Testing', 'Git', 'System Design', 'Performance Optimization', 'Tailwind CSS', 'CI/CD'],
  projects: [
    {
      id: crypto.randomUUID(),
      name: 'Applicant Tracker',
      description: 'Built a Kanban-style job application tracker with local persistence, analytics, role filters, and PDF-ready reporting.'
    }
  ],
  certifications: ['Google Cloud Digital Leader'],
  targetRole: 'Software Engineer',
  customRole: '',
  yearsOfExperience: 3,
  industry: 'Technology',
  template: 'modern'
};
