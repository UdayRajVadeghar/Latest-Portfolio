# Portfolio (Next.js)

A clean personal portfolio built with Next.js, TypeScript and Tailwind CSS. It showcases experience, education, achievements, projects and skills in a compact, responsive layout.

This repository contains a production-ready portfolio website that you can customize and deploy.

## Highlights

- Built with Next.js 14 (App Router) and React 18
- Styled with Tailwind CSS and a small UI component set (Card, Badge, Button)
- Uses TypeScript for type safety
- Lightweight, fast, and mobile-first

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lucide icons
- Vercel analytics & speed insights (optional)

## Quick start

Requirements: Node.js 18+ and npm (or pnpm/yarn)

1. Install dependencies

```bash
npm install
# or pnpm install
# or yarn
```

2. Run development server

```bash
npm run dev
# visit http://localhost:3000
```

3. Build for production

```bash
npm run build
npm start
```

## Available scripts

- `dev` - run Next.js in development mode
- `build` - build the production application
- `start` - start the production server (after `build`)
- `lint` - run Next.js/ESLint checks

## Project structure (important files)

- `app/` - Next.js App Router pages and layout
- `components/` - UI and content components (experience, skills, education, achievements, etc.)
- `public/` - static assets (icons, certificate images)
- `styles/` or `globals.css` - global styles (Tailwind)
- `package.json` - project scripts and dependencies

## Content tips (customizing)

- Update experience content in `components/experience.tsx`.
- Update skills in `components/skills.tsx`.
- Update education in `components/education.tsx`.
- Replace or add images (company logos, certificates) in `public/images/` and reference them from components. For example, the IICPC certificate should be placed at `public/images/iicpc.png` if you want it to appear in Achievements.

## Deployment

The project is ready to deploy on Vercel (recommended):

1. Push your repo to GitHub.
2. Import the repo on Vercel and set the root directory to the repository root.
3. Vercel will detect Next.js and set defaults. Deploy.

You can also deploy to any platform that supports Node.js and Next.js apps.

## Accessibility & Performance

This template aims to be accessible and performant out of the box. You can:

- Run Lighthouse audits and the included Vercel Speed Insights
- Optimize images in `public/` and use Next.js image optimizations where appropriate

## Contributing

Small tweaks and improvements are welcome. If you're editing content:

1. Create a branch
2. Make changes (content/images/components)
3. Run `npm run dev` and verify locally
4. Open a pull request with a short description

## Troubleshooting

- If you see type or build errors, ensure TypeScript types are satisfied or run `npm run build` to see errors.
- If a component doesn't render images, confirm the file exists in `public/images/` and the path matches (e.g. `/images/iicpc.png`).

## License

This project is private. Add a license if you open-source it.

---

If you want, I can also:

- Add example environment variables and a `.env.example` if needed
- Add CI/CD workflow (GitHub Actions) for automatic builds
- Auto-import the IICPC image into `public/images/` if you upload it here

Tell me which of the above you'd like next and I'll implement it.
