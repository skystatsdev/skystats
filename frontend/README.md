# SkyStats Frontend

## Setup

1. Install dependencies with `pnpm install`

2. Make a copy of `.env.example` and rename it to `.env`. Fill in the values with your own.

3. Start the server with with the following:
```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## When Contributing

1. Make sure to run `pnpm run lint` and `pnpm run format` before committing to ensure your code is formatted correctly.

2. Make use of PRs and branches to keep the codebase clean.

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
