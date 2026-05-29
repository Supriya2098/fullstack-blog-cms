import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional(),
  category: z.string().max(50).optional(),
  published: z.boolean().optional(),
});

function postDataFromBody(data) {
  return {
    title: data.title,
    content: data.content,
    published: data.published ?? true,
    category: data.category || null,
    imageUrl: data.imageUrl || null,
  };
}

const authorSelect = { id: true, name: true, email: true };

router.get('/', async (_req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: authorSelect },
      _count: { select: { comments: true } },
    },
  });
  res.json({ posts });
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: authorSelect },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: { author: { select: authorSelect } },
      },
    },
  });

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json({ post });
});

router.post('/', authenticate, async (req, res) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const post = await prisma.post.create({
    data: {
      ...postDataFromBody(parsed.data),
      authorId: req.userId,
    },
    include: { author: { select: authorSelect } },
  });

  res.status(201).json({ post });
});

router.put('/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (existing.authorId !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to edit this post' });
  }

  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const post = await prisma.post.update({
    where: { id },
    data: postDataFromBody(parsed.data),
    include: { author: { select: authorSelect } },
  });

  res.json({ post });
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (existing.authorId !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this post' });
  }

  await prisma.post.delete({ where: { id } });
  res.json({ message: 'Post deleted successfully' });
});

export default router;
