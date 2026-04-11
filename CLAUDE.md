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
