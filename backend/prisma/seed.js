import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEAM = [
  {
    email: 'supriyakusuma0905@gmail.com',
    name: 'Supriya Kusuma',
    password: 'Supriya@2003',
  },
  {
    email: 'saikrishna@gmail.com',
    name: 'Sai Krishna',
    password: 'Sai@2003',
  },
  {
    email: 'chakri@gmail.com',
    name: 'Chakri',
    password: 'Chakri@2003',
  },
  {
    email: 'sowmya@gmail.com',
    name: 'Sowmya',
    password: 'Sowmya@2003',
  },
];

const FULL_STACK_POSTS = [
  {
    title: 'Why React Still Dominates the Frontend in 2026',
    category: 'React',
    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    authorEmail: 'supriyakusuma0905@gmail.com',
    content: `In my opinion, React remains the pragmatic choice for most full-stack teams—not because it's flawless, but because the ecosystem maturity wins.

Hooks + component composition still map cleanly to product thinking. Server Components and frameworks like Next.js have pushed React closer to full-stack without abandoning the mental model millions of developers already know.

Verdict: Learn reconciliation, effects, and composition deeply—then layer tools on top.`,
  },
  {
    title: 'Node.js + Express: Still the Backbone of APIs',
    category: 'Node.js',
    imageUrl:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80',
    authorEmail: 'saikrishna@gmail.com',
    content: `JavaScript on the server is default for full-stack developers today.

Express gives minimal opinions, middleware pipelines, and fast iteration. Pair it with Prisma for type-safe DB access and Zod for validation—you get a stack that's easy to explain in interviews and ship in weeks.

Hot take: Don't reach for microservices until a monolithic Express API actually hurts.`,
  },
  {
    title: 'SQL vs NoSQL: What I Choose as a Full-Stack Developer',
    category: 'Database',
    imageUrl:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80',
    authorEmail: 'chakri@gmail.com',
    content: `Relational databases (PostgreSQL, SQLite) are my default for blogs, e-commerce, and anything with clear entities and relationships.

For this blog CMS, SQLite + Prisma is perfect locally with an easy path to Postgres in production. ORMs are leverage when you understand the SQL they generate.

Rule of thumb: model your domain first. If relationships matter, go SQL.`,
  },
  {
    title: 'REST vs GraphQL: Honest Opinion from Building CRUD Apps',
    category: 'API Design',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    authorEmail: 'sowmya@gmail.com',
    content: `REST is underrated for clarity. Each resource maps to a URL; HTTP verbs express intent; caching and tooling are universal.

GraphQL reduces over-fetching—but you pay in complexity: resolvers, N+1 queries, and schema governance.

For internship-scale projects, REST gets you 90% of the value. Match the API style to your team and clients.`,
  },
  {
    title: 'JWT Authentication: What Works and What to Watch For',
    category: 'Security',
    imageUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    authorEmail: 'supriyakusuma0905@gmail.com',
    content: `JWTs are stateless and scale well for SPAs: login once, send Bearer token on each request.

Use bcrypt for passwords, sensible token expiry, and protected routes on the server. Never store JWTs in URLs.

Security isn't a library—it's a habit. Hash passwords, validate input, and fail closed.`,
  },
  {
    title: 'Deploying Full-Stack Apps: Vercel + Render Playbook',
    category: 'DevOps',
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    authorEmail: 'saikrishna@gmail.com',
    content: `The modern full-stack deploy path: React on Vercel, API on Render/Railway, managed Postgres for data.

Environment variables are the contract between frontend and backend. CI/CD can be as simple as git push triggers build.

Deploy early—production teaches CORS, env vars, and migrations in ways localhost never will.`,
  },
  {
    title: 'TypeScript on the Full Stack: Worth the Learning Curve',
    category: 'TypeScript',
    imageUrl:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80',
    authorEmail: 'chakri@gmail.com',
    content: `TypeScript catches bugs before runtime and makes refactoring safer across frontend and backend.

Start with strict mode in new files, type your API responses, and let Prisma generate DB types. The upfront cost pays off on every team project.`,
  },
  {
    title: 'Git Workflow Our Team Uses for Full-Stack Projects',
    category: 'DevOps',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    authorEmail: 'sowmya@gmail.com',
    content: `Feature branches, descriptive commits, and PR reviews keep our stack projects clean.

We pair frontend and backend changes in one PR when they're coupled, and use README setup steps so anyone on the team can run the app locally in minutes.`,
  },
];

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();

  const oldEmails = ['alice@example.com', 'bob@example.com'];
  await prisma.user.deleteMany({ where: { email: { in: oldEmails } } });

  const usersByEmail = {};

  for (const member of TEAM) {
    const hashed = await bcrypt.hash(member.password, 10);
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: { name: member.name, password: hashed },
      create: {
        email: member.email,
        name: member.name,
        password: hashed,
      },
    });
    usersByEmail[member.email] = user;
  }

  const createdPosts = [];
  for (const post of FULL_STACK_POSTS) {
    const author = usersByEmail[post.authorEmail];
    const created = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        category: post.category,
        authorId: author.id,
      },
    });
    createdPosts.push(created);
  }

  await prisma.comment.create({
    data: {
      content: 'Great React take, Supriya! The ecosystem point is spot on.',
      postId: createdPosts[0].id,
      authorId: usersByEmail['saikrishna@gmail.com'].id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Sai Krishna — Express + Prisma is exactly our stack too.',
      postId: createdPosts[1].id,
      authorId: usersByEmail['sowmya@gmail.com'].id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Chakri, your SQL vs NoSQL breakdown is super clear.',
      postId: createdPosts[2].id,
      authorId: usersByEmail['supriyakusuma0905@gmail.com'].id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Sowmya — REST first is the right call for our internship project.',
      postId: createdPosts[3].id,
      authorId: usersByEmail['chakri@gmail.com'].id,
    },
  });

  console.log('Seed completed.\n');
  console.log('Team login credentials:');
  for (const m of TEAM) {
    console.log(`  ${m.name}: ${m.email} / ${m.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
