const fs = require('fs');
const content = fs.readFileSync('src/data/posts.ts', 'utf8');
const categories = content.match(/category: '([^']*)'/g);
const counts = {};
if (categories) {
  for (const match of categories) {
    const category = match.match(/'([^']*)'/)[1];
    counts[category] = (counts[category] || 0) + 1;
  }
}
console.log(counts);
