export function getCategoryBadgeClass(category) {
  if (!category) return 'badge-default';
  const c = category.toLowerCase();
  if (c.includes('react') || c.includes('frontend')) return 'badge-react';
  if (c.includes('node') || c.includes('api') || c.includes('devops')) return 'badge-node';
  if (c.includes('database') || c.includes('security')) return 'badge-db';
  return 'badge-default';
}

export const DEFAULT_POST_IMAGE =
  'https://images.unsplash.com/photo-1517694712202-008ddfe3c921?w=1200&q=80';

export const CATEGORIES = [
  'React',
  'Node.js',
  'Database',
  'API Design',
  'Security',
  'DevOps',
  'TypeScript',
  'Other',
];
