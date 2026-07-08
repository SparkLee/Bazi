<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single-service Next.js 16 (App Router) static-export app. Standard commands live in `package.json` scripts and `Makefile`; use `npm run dev` / `npm run build` / `npm run lint`.

- Non-obvious: `next.config.ts` sets `basePath`/`assetPrefix` to `/project/oBfjZLkg` (override with the `BASE_PATH` env var). This prefix applies in `next dev` too, so the app is served at `http://localhost:3000/project/oBfjZLkg/` — the bare `http://localhost:3000/` returns 404. Set `BASE_PATH=` (empty) to serve at root.
- `output: "export"` means build produces static HTML in `out/`; there is no Node server runtime (`npm start` is not used for this static export).
- `npm run lint` currently reports one pre-existing error and one warning in `components/` (unrelated to environment setup).
