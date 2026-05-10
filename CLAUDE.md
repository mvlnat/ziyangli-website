# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm start` - Start development server at ziyangli/
- `npm run build` - Build production version
- `npm test` - Run Jest tests
- `npm run serve` - Serve built static files locally

### Deployment
- `npm run deploy` - Deploy to GitHub Pages (builds and pushes to gh-pages branch)

**Pre-deployment checklist (ALWAYS run before deploying):**
1. `npm run build` - Verify build succeeds without errors
2. Verify `build/CNAME` file exists and contains `ziyang.li`
3. `npm run serve` - Test the built site locally (optional but recommended)
4. Check that all links work and pages load correctly
5. Test on mobile viewport
6. Only after verification: `npm run deploy`

**Why we test the build:**
- Catches build errors before they hit production
- Ensures CNAME file is generated correctly
- Verifies no broken imports or missing dependencies
- Prevents deploying a broken site to GitHub Pages

## Development Best Practices

### Testing Philosophy
- **Keep test infrastructure** (Jest, React Testing Library) for future use
- **Don't write unit tests** for simple components (not worth the overhead)
- **DO test the build process** before every deployment
- If complex interactive features are added later (games, calculators, etc.), add tests for those specific features
- Manual verification is sufficient for static content and simple interactions

### Performance
- **ALWAYS check performance after implementing a major feature**
- Run Lighthouse audits regularly
- Check bundle size after adding dependencies
- Test on slow connections and mobile devices
- Monitor Core Web Vitals (LCP, FID, CLS)

**How to verify performance improvements:**
1. Run `npm install` to update dependencies after package.json changes
2. Run `npm run build` to create production bundle
3. Check bundle size: `ls -lh ziyangli/build/static/js/*.js`
4. Run Lighthouse audit in Chrome DevTools (Performance tab)
5. Check web-vitals output in browser console during development
6. Compare bundle sizes before/after changes

**Performance baseline (before optimization):**
- Main bundle: 220KB (with MUI dependencies)

**Current optimizations:**
- Removed MUI Material UI library (only used for 1 icon)
- Removed @emotion dependencies (MUI peer deps)
- Replaced MUI LinkedIn icon with inline SVG (saved ~200KB+)
- Enabled web-vitals console logging for monitoring

## Architecture Overview

This is a React-based personal website for ziyang.li with the following key architectural patterns:

### Project Structure
- **Main app**: Located in `ziyangli/` subdirectory (not root)
- **Components**: React components in `ziyangli/src/components/`

### Key Components
- **App.tsx**: Main application - simple single-page personal website
- **DarkModeToggle**: Theme switching functionality (defaults to dark mode)
- **LinkedInButton**: Social media integration component

### Build Process
1. React build process bundles the application
2. `CNAME` file is automatically created for GitHub Pages hosting

### Deployment Architecture
- **Hosting**: GitHub Pages with custom domain (ziyang.li)
- **Build**: Static React app deployed to `gh-pages` branch

### Notable Patterns
- Age calculation based on hardcoded birthdate (2000-08-28)
- Dark mode as default theme preference
- Simple single-page layout without routing

## Writing Blog Posts

### Quick Start

1. Create post file: `ziyangli/src/posts/YYYY-MM-post-slug.tsx`
2. Register in: `ziyangli/src/posts/index.ts`
3. Run `npm start` to preview

### Step 1: Create the Post File

Create a new TSX file in `ziyangli/src/posts/` with naming convention `YYYY-MM-descriptive-name.tsx`:

```tsx
import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';
import BlogImage from '../components/blog/BlogImage';

const MyNewPost: React.FC = () => {
  return (
    <>
      <p>Introduction paragraph...</p>

      <h2>Section Heading</h2>
      <p>Section content...</p>

      {/* Code blocks with syntax highlighting */}
      <CodeBlock language="typescript">
{`const example = "code here";`}
      </CodeBlock>

      {/* Images with optional caption */}
      <BlogImage
        src="/images/blog/my-image.png"
        alt="Description"
        caption="Optional caption"
      />

      <h2>Another Section</h2>
      <ul>
        <li>Bullet points work</li>
        <li>As do numbered lists</li>
      </ul>

      <blockquote>
        Blockquotes for emphasis or citations.
      </blockquote>
    </>
  );
};

export default MyNewPost;
```

### Step 2: Register the Post

Add import and metadata to `ziyangli/src/posts/index.ts`:

```tsx
// Add import at top
import MyNewPost from './2026-05-my-new-post';

// Add to blogPosts registry
'my-new-post': {
  id: '2026-05-my-new-post',
  slug: 'my-new-post',              // URL: /blog/my-new-post
  title: 'My Post Title',
  description: 'Brief description for previews and SEO.',
  date: '2026-05-10T00:00:00Z',     // ISO date
  author: 'Ziyang Li',
  category: 'Tech',                  // Tech, Leetcode, AI, Personal
  tags: ['React', 'Tutorial'],
  readTime: 10,                      // minutes
  published: true,
  featured: false,                   // show on homepage
  coverImage: '/images/blog/cover.jpg',  // optional
  component: MyNewPost,
},
```

### Step 3: Adding Images

Images go in `ziyangli/public/images/blog/`:

```
ziyangli/public/images/blog/
├── my-post-screenshot.png
├── diagram.svg
└── cover-image.jpg
```

Reference in posts with absolute path:
```tsx
<BlogImage
  src="/images/blog/my-post-screenshot.png"
  alt="Screenshot showing the feature"
  caption="The new dashboard layout"
/>
```

Or use standard img tag:
```tsx
<img src="/images/blog/diagram.svg" alt="Architecture diagram" />
```

### Available Components

| Component | Usage |
|-----------|-------|
| `<CodeBlock language="tsx">` | Syntax-highlighted code blocks |
| `<BlogImage src="" alt="">` | Images with optional caption |
| `<h2>`, `<h3>` | Section headings |
| `<p>` | Paragraphs |
| `<ul>`, `<ol>`, `<li>` | Lists |
| `<blockquote>` | Block quotes |
| `<code>` | Inline code |
| `<a href="">` | Links |

### Supported Code Languages

CodeBlock supports: `typescript`, `tsx`, `javascript`, `jsx`, `python`, `bash`, `json`, `css`, `html`, `markdown`, `plaintext`, `go`, `rust`, `sql`

### Categories

Current categories (defined order): `Personal`, `AI`, `Leetcode`, `Tech`

### Metadata Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique ID matching filename |
| `slug` | Yes | URL path (kebab-case) |
| `title` | Yes | Display title |
| `description` | Yes | Preview text, SEO |
| `date` | Yes | ISO date string |
| `author` | Yes | Author name |
| `component` | Yes | React component reference |
| `category` | No | Main category |
| `tags` | No | Array of tags |
| `readTime` | No | Minutes to read |
| `published` | No | Default true, set false for drafts |
| `featured` | No | Show on homepage |
| `coverImage` | No | Path to cover image |

### TODO

#### Core Infrastructure
- implement routing and navigation
- new folder under `ziyangli/src/` called `pages`
- it will contain React pages for different sections of the website

#### What Actually Matters (Priority)

**Content that shows who you are:**
- **Projects/Portfolio section**: Show what you've built
  - Descriptions of each project
  - Technologies used
  - Links to live demos or source code
  - Brief explanations of what problems they solve
- **Blog**: Add a blog section to share thoughts, knowledge, and show how you think
- **About section**: Improve current content (what you do, what you care about)
- **Profile picture/photo**: Add personal touch

**Easy Navigation:**
- Clear site structure
- Mobile responsive design
- Intuitive menu/navigation

**Accessibility:**
- Keyboard navigation
- Screen reader support (ARIA labels, semantic HTML)
- Good contrast ratios
- Respect prefers-reduced-motion

**Contact/Links:**
- Email contact (mailto link styled nicely)
- Links to GitHub, LinkedIn, and other relevant platforms
- Make it easy to reach you

**Performance:**
- Fast load times
- No unnecessary bloat
- Works on slow connections
- Lazy loading for images

**Writing/Blog features:**
- RSS feed
- Client-side search across content
- Simple markdown rendering

#### Fun Interactive Experiments (Lower Priority)
- **Interactive apps**: Build simple client-side apps (no backend needed)
  - Example: "danger-type" - user types and if they stop typing, it deletes all text (ziyang.li/danger-type)
  - Other lightweight interactive experiences
- **Dynamic elements**: Add random changes on page reload (subtle variations)
- **Animated greeting variations**: Rotate greetings, or typewriter effect

#### Nice-to-Haves
- "Now" page (what you're currently doing, learning, reading)
- Reading list (books/articles you recommend)
- Skills visualization
- Resume/CV download
