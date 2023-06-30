# SkyStats Frontend

## Developing

1. Install dependencies with `pnpm install`

2. Make a copy of `.env.example` and rename it to `.env`. Fill in the values with your own.

3. Start the server with with the following:
```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
