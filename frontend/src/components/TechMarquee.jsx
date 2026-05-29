import './TechMarquee.css';

const TECH = [
  'React',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MongoDB',
  'REST APIs',
  'JWT',
  'Prisma',
  'TypeScript',
  'Docker',
  'Git',
  'Vite',
  'GraphQL',
  'Redis',
  'AWS',
  'CI/CD',
];

export default function TechMarquee() {
  const items = [...TECH, ...TECH];

  return (
    <div className="tech-marquee" aria-hidden="true">
      <div className="tech-marquee-track">
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className="tech-marquee-item">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
