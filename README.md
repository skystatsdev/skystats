# SkyStats
SkyStats Website/API Monorepo

## Setup
1. Clone the repo

2. Follow the instructions in the `backend` and `frontend` folders

3. Start up the servers that you won't be developing in with the following:

```bash
docker-compose up -d website # Working on backend
docker-compose up -d api database # Working on frontend
docker-compose up -d database # Working on both
```

For these to work properly, you will need to have the `.env` files in the `backend` and `frontend` folders filled out with the correct connection information.


## Deploying

1. Make a copy of both `.env.example` files in the subfolders and rename them to `.env.production`. Fill in the values with the internal hostnames of the containers.

2. Startup the containers with the correct ovveride file as follows:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```