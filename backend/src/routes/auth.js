import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function userResponse(user) {
  return { id: user.id, email: user.email, name: user.name };
}

function zodMessage(result) {
  const issue = result.error.issues?.[0] ?? result.error.errors?.[0];
  return issue?.message ?? 'Invalid input';
}

router.post('/signup', async (req, res) => {
  try {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: zodMessage(parsed) });
  }

  const { email, name, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, password: hashed },
  });

  const token = createToken(user.id);
  res.status(201).json({ user: userResponse(user), token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Could not create account. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: zodMessage(parsed) });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createToken(user.id);
  res.json({ user: userResponse(user), token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

export default router;
