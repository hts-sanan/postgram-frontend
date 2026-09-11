# Postgram Frontend

React frontend for Postgram — a social media app where users can post
text/images, like, comment, and share posts, with public profiles and
username/password login.

## Tech Stack

- **Framework:** React + TypeScript (via Vite)
- **Containerization:** Docker

## Prerequisites

Install these on your machine before starting:

- **Docker Desktop** — download from docker.com/products/docker-desktop
  - Choose the correct version for your chip: check with `uname -m` (Mac) —
    `arm64` = Apple Silicon, `x86_64` = Intel
  - Open Docker Desktop once after installing, and wait for the whale icon
    to show "running"
  - Verify it's working:
    ```
    docker --version
    docker run hello-world
    ```
- **Git** — verify with:
  ```
  git --version
  ```
- **Code editor** (VS Code, Antigravity, etc.) — optional but recommended.

You do not need to install Node.js or npm separately — Docker handles that
inside the container.

## Getting the Code

```bash
git clone https://github.com/HiLITE-Technologies/postgram-frontend
cd postgram-frontend
```

## Project Structure

The app has grown from the initial POC into a feature-based architecture.
Everything still runs through the same Dockerfile described below — this
section just reflects what's actually in `src/` now:

```text
postgram-frontend/
├── src/
│   ├── app/            # composition root: App.tsx, router, providers, config, route guards
│   ├── assets/
│   ├── components/
│   │   ├── ui/         # generic building blocks (Button, Input, Avatar, Modal, Dropdown...)
│   │   ├── common/     # shared composites (EmptyState, ConfirmDialog)
│   │   └── feedback/   # loading/skeleton/spinner UI
│   ├── features/       # business logic: auth, posts, comments, profile
│   │   └── <feature>/
│   │       ├── components/  # feature-specific UI
│   │       ├── hooks/        # data fetching + actions
│   │       ├── services/     # service interface + mock implementation + resolver
│   │       └── types/         # feature-specific types (when not shared)
│   ├── widgets/         # larger reusable sections: PostCard, FeedList, Sidebar, Topbar...
│   ├── layouts/         # AppLayout (authenticated shell), AuthLayout (login/signup)
│   ├── pages/           # routable screens; compose layouts + widgets
│   ├── services/
│   │   ├── api/         # centralized HTTP client (base URL, auth header, error handling)
│   │   └── mocks/        # mock data + delay/id helpers
│   ├── store/           # AuthContext
│   ├── hooks/           # cross-feature hooks (useDisclosure, useOnClickOutside)
│   ├── types/           # shared domain models (User, Post, Comment)
│   ├── utils/           # pure helpers (formatRelativeTime, classNames, initials)
│   ├── constants/       # centralized route paths
│   ├── styles/          # design tokens (variables.css) + global reset
│   └── main.tsx         # app entry point
├── public/
├── tests/               # unit tests (Vitest + Testing Library)
├── docker/
│   └── nginx.conf       # used only by the optional production image (see below)
├── Dockerfile           # builds this app into a container — see below
├── .dockerignore
└── vite.config.ts
```

## Running This Repo with Docker

**Build the image:**

```bash
docker build -t postgram-frontend .
```

**Run the container:**

```bash
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules postgram-frontend
```

Then open http://localhost:5173 in your browser. Changes to files in `src/`
hot-reload automatically thanks to the volume mount.

**Stop the container:** press `Ctrl + C` in the terminal, or find and stop
it separately:

```bash
docker ps                  # find the container ID
docker stop <container-id>
```

> The Dockerfile has a couple of additional internal stages used to build a
> production image (see "Production build" below), but they don't change
> anything about the commands above — a plain `docker build`/`docker run`
> with no extra flags always gives you the dev server on port 5173, exactly
> as documented here.

## Day-to-Day Workflow

**Starting work:**

```bash
git pull
docker build -t postgram-frontend .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules postgram-frontend
```

**While working:** edit files in `src/` normally — no rebuild needed for
source code changes, thanks to the volume mount and Vite's hot-reload.

**If you install a new npm package:**

```bash
docker build -t postgram-frontend .    # rebuild the image since package.json changed
```

## Useful Commands

| Command                              | What it does                                  |
| ------------------------------------- | ---------------------------------------------- |
| `docker images`                       | List built images, confirm postgram-frontend exists |
| `docker ps`                           | List currently running containers              |
| `docker logs <container-id>`          | View logs from a running container             |
| `docker exec -it <container-id> sh`   | Open a shell inside the running container      |

## Production Build (optional)

The Dockerfile includes two extra stages — `build` (compiles the app) and
`prod` (serves the compiled output via nginx) — that are never built unless
explicitly requested with `--target`. They exist for sanity-checking the
production build or for eventual deployment; they don't affect the
day-to-day workflow above at all.

```bash
docker build --target prod -t postgram-frontend:prod .
docker run -p 8080:80 postgram-frontend:prod
```

Then open http://localhost:8080.

## Optional: docker-compose

`docker-compose.yml` and `docker-compose.prod.yml` are thin, optional
wrappers around the exact same Dockerfile/commands above — useful if you'd
rather type `docker compose up` than the full `docker run ...` line. Nobody
needs them; the `docker build`/`docker run` commands documented above are
the team baseline and always work on their own.

```bash
docker compose up            # equivalent to the dev docker run command above
docker compose down          # stop it
docker compose -f docker-compose.prod.yml up --build   # equivalent to the prod build above
```

## Environment Variables

See `.env.example`. The two that matter today:

- `VITE_USE_MOCKS` — `true` (the default even with no `.env` file present)
  keeps every feature on its mock service. Leave this on until the backend
  is ready.
- `VITE_API_BASE_URL` — base URL the real API client will use once
  `VITE_USE_MOCKS=false` and the `Api*Service` implementations are wired up
  (see "Architecture notes" below).

## Architecture Notes

**Services are interfaces, not concrete calls.** Every feature exposes a
`XService` interface plus a `mockXService` implementation, resolved in an
`index.ts` behind `config.useMocks`. Components and hooks only ever import
the resolved `xService` — never the mock directly — so replacing a mock
with a real backend-backed implementation later is a one-file change per
feature:

```text
UI → hook → <feature>Service (interface) → mockXService | ApiXService
```

**No mock data or business logic inside components.** Mock data lives in
`services/mocks/data`; components receive it through hooks (`usePosts`,
`useComments`, …) that call the resolved service.

**Design tokens over hard-coded values.** Every color, spacing, radius,
shadow and breakpoint used across the app is a CSS variable in
`styles/variables.css`, sourced from the Figma files.

**Pages vs. widgets vs. components.** Pages compose layouts + widgets and
hold minimal logic. Widgets (`PostCard`, `FeedList`, `Sidebar`, …) are the
reusable, larger sections that appear across pages. Components (`Button`,
`Avatar`, `Modal`, …) are the smallest reusable building blocks with no
domain knowledge.

**Backend migration path:** once the real API is ready, implement
`Api<Feature>Service` against the interface in
`features/<feature>/services/<feature>Service.ts`, swap the resolver in
that feature's `services/index.ts`, and set `VITE_USE_MOCKS=false` +
`VITE_API_BASE_URL`. No page, widget, or component needs to change.

## Known Placeholders

- **Create Post page** (`pages/create-post`) — the Figma design for this
  screen hasn't been finalized yet. Routing and every entry point (sidebar
  button, feed composer, profile "Create New Post") already point at
  `/create-post`; only the page's contents will change once the design
  lands.

## Contributing

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make changes, test locally with Docker as shown above
3. Commit and push: `git push origin feature/your-feature-name`
4. Open a Pull Request on GitHub for review

## Troubleshooting

- **"command not found: docker"** → Docker Desktop isn't installed or
  running. Open the app and wait for it to fully start.
- **Port 5173 already in use** → Another process is using it. Stop it, or
  run with a different port: `-p 5174:5173` and visit `localhost:5174`
  instead.
- **Changes not appearing** → Confirm the volume mount (`-v $(pwd):/app`)
  is included in your `docker run` command.
