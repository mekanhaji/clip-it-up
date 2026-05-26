<p align="center">
  <img
    src="https://res.cloudinary.com/dtzh7uewv/image/upload/v1779807649/clipitup%40kanhaji.png"
    alt="ClipItUp - Instant Clipboard Sharing"
    />
</p>

# ClipItUp : Share Clipboard

> Lightweight clipboard sharing web app (react + Go server) for quickly syncing clipboard contents between devices.

Why this project

- Fast, minimal UI for copying/pasting across devices
- Real-time updates using WebSockets
- Simple self-hosted stack you can run locally or deploy

Key features

- Real-time clipboard sync between connected clients
- Web UI for browsing recent clipboard items
- Small Go backend and React + Vite frontend

Tech stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Go (WebSocket-based)

Getting started : development

Prerequisites

- Node.js (16+), npm or yarn
- Go (1.20+)

Run the backend

1. Open a terminal and change to the server folder:

```bash
cd server
```

2. Fetch dependencies and run the server:

```bash
go mod download
go run main.go
```

Run the frontend

1. In a separate terminal change to the client folder:

```bash
cd client
```

2. Install dependencies and start the dev server:

```bash
# use npm or yarn
npm install
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173) in your browser.

Build & deploy

- Build frontend: `cd client && npm run build`
- Build backend: `cd server && go build -o clipitup`

Project layout

- `client/` -> React + Vite frontend
- `server/` -> Go backend (WebSocket server)
- `tmp/` -> temporary files

Contributing

- Bug reports, feature requests and PRs are welcome. Please open issues with clear reproduction steps.

License

- This project is provided under the MIT License.

Acknowledgements

- Built by mekanhaji 👷🏻‍♂️ thanks to the open-source ecosystem for libraries and tooling used here.
