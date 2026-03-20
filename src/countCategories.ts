import { posts } from './data/posts';

const counts: Record<string, number> = {};

for (const post of posts) {
  const category = post.category;
  if (category) {
    counts[category] = (counts[category] || 0) + 1;
  }
}

console.log(counts);
