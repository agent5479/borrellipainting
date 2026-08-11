# Borrelli Painting

Marketing site for Gianluca (Luca) Borrelli — interior and exterior painting in Golden Bay.

Live: [https://agent5479.github.io/borrellipainting/](https://agent5479.github.io/borrellipainting/)

## Develop

```bash
npm install
npm run dev
```

The app is served at `/borrellipainting/` (same path as GitHub Pages).

```bash
npm run build
```

Builds the React app and prerenders `/`, `/quote/freshcoat`, and `/quote/paintboard` to static HTML for SEO.

## Gallery photos

Drop themed series into `public/images/gallery/<theme>/` and add entries in `src/content/gallery.ts`.

Current themes: `exteriors`, `interiors`, `on-the-job`.
