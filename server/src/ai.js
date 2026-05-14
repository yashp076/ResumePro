import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { flatRoles } from './data/roles.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

const fallbackTips = {
  experience: 'Lead with a strong action verb, include the scope, and end with a measurable result.',
  skills: 'Prioritize keywords that appear in target job descriptions and match your actual strengths.',
  summary: 'Keep the summary to 2-3 lines with role, strengths, domain, and measurable impact.'
};

function roleKeywords(roleName) {
  const normalized = roleName.toLowerCase();
  return flatRoles.find((role) => role.title.toLowerCase() === normalized)?.keywords
    || ['communication', 'collaboration', 'analysis', 'delivery', 'problem solving', 'ownership'];
}

function fallbackSuggestions({ role, section, context }) {
  const keywords = roleKeywords(role);
  const years = context?.yearsOfExperience || 2;
  const industry = context?.industry || 'the target industry';
  const skills = context?.skills?.length ? context.skills : keywords;
  const firstExperience = context?.experience?.find((item) => item.role || item.company || item.bullets?.length);
  const firstProject = context?.projects?.find((project) => project.name || project.description);
  const projectDescription = firstProject?.description?.replace(/[.。]\s*$/, '');
  const experienceSignal = firstExperience
    ? `${firstExperience.role || 'professional experience'}${firstExperience.company ? ` at ${firstExperience.company}` : ''}`
    : `${industry} experience`;
  const projectSignal = firstProject
    ? `${firstProject.name || 'a relevant project'}${projectDescription ? `, a project focused on ${projectDescription.charAt(0).toLowerCase()}${projectDescription.slice(1)}` : ''}`
    : 'practical project work';

  if (section === 'skills') {
    return {
      suggestions: keywords,
      keywords,
      tip: fallbackTips.skills,
      source: 'fallback'
    };
  }

  if (section === 'summary') {
    return {
      suggestions: [
        `${role} with ${years}+ years of experience delivering measurable outcomes across ${industry}, with hands-on strengths in ${skills.slice(0, 5).join(', ')}. Brings direct exposure to ${experienceSignal}, using structured problem-solving and cross-functional collaboration to turn requirements into reliable work. Supported by ${projectSignal}, with a strong focus on performance, maintainability, and user impact while adapting quickly to business priorities.`,
        `Results-focused ${role} with a strong foundation in ${skills.slice(0, 6).join(', ')} and a track record of contributing to high-quality work in ${industry}. Experienced in applying lessons from ${experienceSignal} to solve technical problems, improve workflows, and support dependable delivery. Combines analytical thinking, ownership, and practical project experience through ${projectSignal} to build solutions aligned with business goals.`,
        `Detail-oriented ${role} bringing ${years}+ years of experience across ${industry}, with practical expertise in ${skills.slice(0, 5).join(', ')}. Skilled at building, improving, and maintaining systems informed by ${experienceSignal} and demonstrated through ${projectSignal}. Recognized for consistent delivery, clear communication, and the ability to learn quickly while contributing to team productivity and product success.`
      ],
      keywords,
      tip: fallbackTips.summary,
      source: 'fallback'
    };
  }

  return {
    suggestions: [
      `Delivered ${keywords[0]} initiatives for ${industry}, improving workflow efficiency by 25% through clearer requirements, automation, and stakeholder alignment.`,
      `Collaborated with cross-functional teams to design and launch ${keywords[1]} solutions, reducing turnaround time and improving quality across recurring deliverables.`,
      `Analyzed performance data and applied ${keywords[2]} best practices to identify gaps, prioritize fixes, and increase measurable business impact.`
    ],
    keywords,
    tip: fallbackTips.experience,
    source: 'fallback'
  };
}

function geminiFailureMessage(error) {
  const message = error?.message || '';
  if (message.includes('[429 Too Many Requests]') || message.includes('Quota exceeded')) {
    return 'Gemini quota unavailable for this key/project; fallback suggestions used.';
  }
  if (message.includes('[404 Not Found]') || message.includes('is not found')) {
    return 'Gemini model unavailable; fallback suggestions used.';
  }
  if (message.includes('API key')) {
    return 'Gemini API key issue; fallback suggestions used.';
  }
  return 'Gemini request failed; fallback suggestions used.';
}

function providerFailureMessage(provider, error) {
  const message = error?.message || '';
  if (message.includes('429') || message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('quota')) {
    return `${provider} rate limit or quota unavailable; fallback suggestions used.`;
  }
  if (message.includes('401') || message.includes('403') || message.toLowerCase().includes('api key')) {
    return `${provider} API key issue; fallback suggestions used.`;
  }
  if (message.includes('404') || message.toLowerCase().includes('model')) {
    return `${provider} model unavailable; fallback suggestions used.`;
  }
  return `${provider} request failed; fallback suggestions used.`;
}

function buildPrompt({ role, section, context }) {
  const sectionRules = {
    summary: [
      'Each suggestion must be a complete professional summary paragraph, not a question.',
      'Write 3 to 4 substantial sentences per suggestion.',
      'Each summary must be 65 to 95 words.',
      'Use evidence from context.experience, context.projects, context.skills, context.education, and context.certifications when available.',
      'Mention years of experience when available, core technical or role skills, measurable impact, collaboration style, project evidence, and target industry fit.',
      'Prefer specific project names, experience bullets, and skills from the context over generic wording.',
      'Do not start with verbs like Developed, Improved, Managed, or Collaborated.',
      'Do not ask the user for missing information.',
      'Do not include question marks.'
    ],
    experience: [
      'Each suggestion must be one resume bullet point, not a question.',
      'When context.experienceItem is provided, write bullets specifically for that role and company.',
      'Use context.experienceItem.role, context.experienceItem.company, existing bullets, skills, and projects as hints.',
      'Start every bullet with a strong past-tense action verb.',
      'Include a metric, scope, or measurable result where possible.',
      'Do not ask the user for missing information.',
      'Do not include question marks.'
    ],
    skills: [
      'Each suggestion must be one short skill keyword or keyword phrase.',
      'Do not write sentences.',
      'Do not ask questions.',
      'Do not include question marks.'
    ]
  };

  return `You are an expert resume writer. Generate JSON only for a ${role} resume.
Section: ${section}
Context: ${JSON.stringify(context || {})}
Return this exact shape:
{
  "suggestions": ["3 to 8 concise resume-ready items"],
  "keywords": ["6 to 10 ATS keywords"],
  "tip": "one practical writing tip"
}
Rules:
- Suggestions must be specific to the role.
- Experience bullets must start with action verbs and include measurable impact when possible.
- Summary suggestions must be professional first-person-free resume summaries.
- Skills must be short keyword phrases.
- Never generate questions, interview prompts, instructions, placeholders, or requests for more information.
- Every suggestion must be ready to insert directly into a resume.
- Section-specific rules: ${sectionRules[section].join(' ')}
- Do not include markdown.`;
}

function parseSuggestions(text, payload, source) {
  const cleaned = text
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    let suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions
        .filter((suggestion) => typeof suggestion === 'string')
        .map((suggestion) => suggestion.trim())
        .filter((suggestion) => suggestion && !suggestion.includes('?') && !/\[|\]|insert|placeholder/i.test(suggestion))
        .slice(0, 8)
      : [];

    if (payload.section === 'summary') {
      suggestions = suggestions.filter((suggestion) => suggestion.split(/\s+/).length >= 45);
    }

    if (!suggestions.length) {
      return fallbackSuggestions(payload);
    }

    return {
      suggestions,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 10) : roleKeywords(payload.role),
      tip: parsed.tip || fallbackTips[payload.section],
      source
    };
  } catch {
    return fallbackSuggestions(payload);
  }
}

async function generateWithGroq(payload) {
  if (!process.env.GROQ_API_KEY) {
    return fallbackSuggestions(payload);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        temperature: 0.35,
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Return valid compact JSON only.'
          },
          {
            role: 'user',
            content: buildPrompt(payload)
          }
        ]
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`${response.status} ${data?.error?.message || response.statusText}`);
    }

    const text = data?.choices?.[0]?.message?.content || '';
    return parseSuggestions(text, payload, 'groq');
  } catch (error) {
    console.warn(providerFailureMessage('Groq', error));
    return fallbackSuggestions(payload);
  }
}

async function generateWithGemini(payload) {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackSuggestions(payload);
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  });

  let text = '';
  try {
    const result = await model.generateContent(buildPrompt(payload));
    text = result.response.text().replace(/^```json|```$/g, '').trim();
  } catch (error) {
    console.warn(geminiFailureMessage(error));
    return fallbackSuggestions(payload);
  }

  return parseSuggestions(text, payload, 'gemini');
}

export async function generateSuggestions(payload) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  if (provider === 'groq') {
    return generateWithGroq(payload);
  }

  return generateWithGemini(payload);
}
