# Postgram Frontend

React frontend for **Postgram** — a social media app where users can post text/images, like, comment, and share posts, with public profiles and username/password login.

## Tech Stack

- **Framework:** React (via Vite)
- **Containerization:** Docker

## Prerequisites

Install these on your machine before starting:

1. **Docker Desktop** — download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
   - Choose the correct version for your chip: check with `uname -m` (Mac) — `arm64` = Apple Silicon, `x86_64` = Intel
   - Open Docker Desktop once after installing, and wait for the whale icon to show "running"
   - Verify it's working:
```bash
     docker --version
     docker run hello-world
```

2. **Git** — verify with:
```bash
   git --version
```

3. **Code editor** (VS Code, Antigravity, etc.) — optional but recommended.

You do **not** need to install Node.js or npm separately — Docker handles that inside the container.

## Getting the Code

```bash
git clone https://github.com/HiLITE-Technologies/postgram-frontend
cd postgram-frontend
```

## Project Structure
postgram-frontend/
├── src/
│ ├── App.jsx # root component
│ ├── main.jsx # app entry point
│ └── assets/
├── public/
├── Dockerfile # builds this app into a container
├── .dockerignore
└── vite.config.js

## Running This Repo with Docker

**Build the image:**
```bash
docker build -t postgram-frontend .
```

**Run the container:**
```bash
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules postgram-frontend
```

Then open [http://localhost:5173](http://localhost:5173) in your browser. Changes to files in `src/` hot-reload automatically thanks to the volume mount.

**Stop the container:** press `Ctrl + C` in the terminal, or find and stop it separately:
```bash
docker ps                  # find the container ID
docker stop <container-id>
```

## Day-to-Day Workflow

**Starting work:**
```bash
git pull
docker build -t postgram-frontend .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules postgram-frontend
```

**While working:** edit files in `src/` normally — no rebuild needed for source code changes, thanks to the volume mount and Vite's hot-reload.

**If you install a new npm package:**
```bash
docker build -t postgram-frontend .    # rebuild the image since package.json changed
```

## Useful Commands

| Command | What it does |
|---|---|
| `docker images` | List built images, confirm `postgram-frontend` exists |
| `docker ps` | List currently running containers |
| `docker logs <container-id>` | View logs from a running container |
| `docker exec -it <container-id> sh` | Open a shell inside the running container |

## Contributing

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make changes, test locally with Docker as shown above
3. Commit and push: `git push origin feature/your-feature-name`
4. Open a Pull Request on GitHub for review

## Troubleshooting

- **"command not found: docker"** → Docker Desktop isn't installed or running. Open the app and wait for it to fully start.
- **Port 5173 already in use** → Another process is using it. Stop it, or run with a different port: `-p 5174:5173` and visit `localhost:5174` instead.
- **Changes not appearing** → Confirm the volume mount (`-v $(pwd):/app`) is included in your `docker run` command.
