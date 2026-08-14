# Borrelli Painting

Marketing site for Gianluca (Luca) Borrelli — interior and exterior painting in Golden Bay.

Live: [https://borrellipainting.nz](https://borrellipainting.nz)

## Develop

```bash
npm install
npm run dev
```

The app is served from the site root (custom domain on GitHub Pages).

```bash
npm run build
```

Builds the React app and prerenders `/` and `/estimates` to static HTML for SEO. Private quote builder lives at `/office`.

## Gallery photos

Drop themed series into `public/images/gallery/<theme>/` and add entries in `src/content/gallery.ts`.

Current themes: `exteriors`, `interiors`, `on-the-job`.
