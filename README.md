# My Personal Website [ziyang.li](https://ziyang.li)
ziyang.li is a website about ziyang li. Add me on [LinkedIn](https://www.linkedin.com/in/ziyangg/)

## About Me
I am a software engineer with a passion for building innovative software. I am currently working at Epic Systems as a Software Engineer.

## Skills
- Programming languages I used at work: JavaScript/TypeScript, C#, M, Erlang, PHP, Python, Java
- Programming languages I used for personal projects: Rust, Go, Elixir
- Frameworks: React, .NET, Django, Flask, Express
- Tools: Git, Docker

## Development

Run commands from `ziyangli/`:

```sh
cd ziyangli
npm ci
npm start
```

The site uses hash routes, for example `/#/blog/kafka-system-design`, so article links work on GitHub Pages without server rewrites.

## Verification

```sh
npm test -- --watchAll=false --runInBand
npm run verify:examples
npm run build
```

The regression suite covers routes, article rendering, search and filters, theme persistence, dates, and presentation controls. The example check compiles and exercises the async utilities extracted from the published article. The build creates `build/CNAME` for `ziyang.li`. GitHub Actions runs these checks before deploying pushes to `main`.
