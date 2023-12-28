# [SkyStats](https://skystats.dev)

A _blazingly fast_ SkyBlock stats website using SvelteKit 🚀 🚀 🚀

## Setup

1. Install dependencies with `pnpm install`

2. Make a copy of `.env.example` and rename it to `.env`. Fill in the values with your own.

3. Start up the needed service(s) with the following:

```bash
docker-compose up -d redis
```

4. Start the website with:

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

## Deploying

1. Make a copy of both `.env.example` files in the subfolders and rename them to `.env.production`. Fill in the values with the internal hostnames of the containers and the correct information for your deployment.

2. Startup the containers with the correct override file as follows:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
