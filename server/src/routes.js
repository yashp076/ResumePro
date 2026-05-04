import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { generateSuggestions } from './ai.js';
import { roleLibrary } from './data/roles.js';

export const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI request limit reached. Please try again in a minute.' }
});

router.get('/roles', (_req, res) => {
  res.json({ categories: roleLibrary });
});

router.post(
  '/ai/suggestions',
  aiLimiter,
  [
    body('role').isString().trim().isLength({ min: 2, max: 80 }),
    body('section').isIn(['experience', 'skills', 'summary']),
    body('context').optional().isObject()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Invalid request', details: errors.array() });
      return;
    }

    try {
      const payload = {
        role: req.body.role,
        section: req.body.section,
        context: req.body.context || {}
      };
      res.json(await generateSuggestions(payload));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/resume/export-pdf', (_req, res) => {
  res.status(501).json({
    error: 'Server-side PDF export is reserved for deployment. Use the client PDF export in the builder.'
  });
});
