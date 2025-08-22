# elitemedical-rh-web

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

## Environment configuration (local vs production)

This project uses Vite env variables to support different profiles.

- Local development: set values in `.env.development` (committed defaults provided) or `.env.local` (not committed).
- Production build: values come from `.env.production`.

Available variables:
- VITE_API_BASE_URL: Base URL for the backend API (e.g., http://localhost:8080/rh or https://elitemedicalbajio.online/rh)
- VITE_BASE_PATH: Public base path for the app (e.g., `/` locally, `/rh-web/` in production)
- VITE_WS_URL: Optional SockJS endpoint (defaults to `${VITE_API_BASE_URL}/ws`)
- VITE_ALLOWED_HOSTS: Comma-separated list for Vite dev server allowed hosts

See `.env.local.example` for a starter template.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
