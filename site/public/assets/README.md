Assets usage for Christmas On Candleflower
=========================================

This folder (`/public/assets`) is for static files that should be copied verbatim to the built site root (for example favicons or static images used directly in `index.html` or server-side references).

Notes and recommended patterns
------------------------------

- For images imported into React components or referenced from CSS modules, prefer placing them in `site/src/assets` and importing them. Example:

```jsx
import logo from './assets/logo.png';
function Header(){
  return <img src={logo} alt="Logo" />;
}
```

This lets Vite bundle and rewrite the URL correctly so it works on both GitHub Pages (with a repo subpath) and any AWS static host.

- Use `public/assets` when you need a stable path available at runtime without an import. Files here are served from the build output root at `/<base>/assets/filename`.

  - In `index.html` (or other static HTML) use the Vite placeholder `%BASE_URL%` so the path respects the configured base:

    ```html
    <link rel="icon" href="%BASE_URL%assets/favicon.ico" />
    ```

  - In JS if you need to reference a public asset path, prefix with `import.meta.env.BASE_URL`:

    ```js
    const img = `${import.meta.env.BASE_URL}assets/large-photo.jpg`;
    ```

- Avoid hard-coded absolute root paths like `/assets/...` in code. On GitHub Pages a repo site often lives at `https://user.github.io/repo-name/`; absolute `/assets/...` would point to the domain root and break. The two safe approaches are:
  1) import images from `src/assets` (preferred), or
  2) reference `public/assets` assets via `import.meta.env.BASE_URL + 'assets/...'` or `%BASE_URL%` in `index.html`.

Adding images
--------------
- Add source-controlled images to `site/src/assets` when you want them bundled.
- Add large or externally managed static assets to `site/public/assets` if you want them copied verbatim and referenced by predictable paths.

Example file locations after build (when `VITE_BASE_URL` is `/` or a subpath):
- Bundled import: `/assets/index.abc123.png` (name hashed by Vite)
- Public asset: `%BASE_URL%assets/photo.jpg` (no hashing)
