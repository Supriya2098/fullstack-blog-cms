import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
});

const authorSelect = { id: true, name: true, email: true };

router.post('/posts/:postId/comments', authenticate, async (req, res) => {
  const postId = Number(req.params.postId);
  if (Number.isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId,
      authorId: req.userId,
    },
    include: { author: { select: authorSelect } },
  });

  res.status(201).json({ comment });
});

router.delete('/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid comment id' });
  }

  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  if (existing.authorId !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this comment' });
  }

  await prisma.comment.delete({ where: { id } });
  res.json({ message: 'Comment deleted successfully' });
});

export default router;
