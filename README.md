```markdown
# Christmas On Candleflower (Site-first)

This repository is a small static site (Vite + React) that presents a Christmas light show. The frontend lives in `site/`. A simple Express-based server is preserved under `archive/server/` for reference or demos.

Recommended approach: treat this project as a static site and host the `site/` build output (Netlify, Vercel, GitHub Pages, or any static host).

Quick start (site-only)

Prereqs: Node 18+ and npm.

1. Install dependencies:

```bash
npm install
```

2. Run the dev server (Vite):

```bash
npm run dev
```

Open the URL Vite prints (default http://localhost:5173) to view the site.

Build for production:

```bash
npm run build
npm run preview
```

Optional: run the archived server for API demos

```bash
npm run dev:server    # runs the archived Express server in watch mode
npm run start:server  # run archived server in production mode
```

Next steps

- If you want to remove the archived server entirely, I can delete `archive/server/` and remove the related scripts.
- If you'd prefer the site files at the repository root (no `site/` folder), I can move them and update scripts.

If you'd like any of those follow-ups, tell me which and I'll make the change.
```

# Christmas On Candleflower (Client-first)

This repository is a small static site (Vite + React) that presents a Christmas light show. The frontend lives in `client/`. A simple Express-based `server/` exists for reference or demo purposes only — it's optional and uses an in-memory store.

Recommended approach: treat this project as a static site and host the `client/` build output (Netlify, Vercel, GitHub Pages, or any static host).

Quick start (client-only)

Prereqs: Node 18+ and npm.

1. Install dependencies:

```bash
npm install
```

2. Run the dev server (Vite):

```bash
npm run dev
```

Open http://localhost:5173 to view the site.

Build for production:

```bash
npm run build
npm run preview
```

Optional: run the server for API demos

```bash
npm run dev:server    # runs the Express server in watch mode
npm run start:server  # run production server
```

Next steps

- If you want to remove the server entirely, we can either delete the `server/` folder or move its code into an `archive/` folder and remove server scripts. I can do that for you if you prefer.
- If you'd like the site served from the repository root (no `client/` prefix), I can move the client files to the root and update scripts.

Contact me with how you'd like to proceed and I'll make the changes.
