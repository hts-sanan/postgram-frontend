# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# base: shared dependency layer. Both the dev and build stages start from
# here so `npm ci` only runs once per lockfile change.
# ---------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---------------------------------------------------------------------------
# build: produces the static production bundle in /app/dist.
# Not used day-to-day — only when building the prod image below.
# ---------------------------------------------------------------------------
FROM base AS build
COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# prod: the static bundle served by nginx. Only built when explicitly
# requested with `--target prod` — see README for the command.
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS prod
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ---------------------------------------------------------------------------
# dev: the team's day-to-day environment — Vite's dev server with HMR,
# source mounted as a volume at `docker run` time (see README).
#
# This stage is intentionally LAST in the file: Docker builds the last stage
# by default when no --target is given, so the documented
#   docker build -t postgram-frontend .
# produces this dev image, not the prod one. Keep this stage last if you add
# any further stages later.
# ---------------------------------------------------------------------------
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
