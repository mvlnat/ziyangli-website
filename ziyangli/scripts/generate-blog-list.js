const fs = require('fs');
const path = require('path');

// Adjust this path to where your MD files are stored
const BLOG_DIR = path.join(__dirname, '../public/posts');

console.log('Looking for MD files in:', BLOG_DIR);

if (!fs.existsSync(BLOG_DIR)) {
  console.error('Blog directory does not exist:', BLOG_DIR);
  process.exit(1);
}

const files = fs.readdirSync(BLOG_DIR);
console.log('Found files:', files);

const blogPosts = files
  .filter(file => file.endsWith('.md'))
  .map((file, index) => ({
    id: index + 1,
    title: file.replace('.md', '').split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    slug: file.replace('.md', '')
  }));

console.log('Generated blog posts:', blogPosts);

// Write to .env file
fs.writeFileSync(
  '.env',
  `REACT_APP_BLOG_POSTS='${JSON.stringify(blogPosts)}'`
);

console.log('.env file updated'); 