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
