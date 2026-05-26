# Contributing to Clip It Up

Thanks for your interest in contributing to Clip It Up. This file describes the
basic workflow we expect contributors to follow and how to get the project
running locally for development.

Getting started

1. Fork the repository and create a descriptive branch for your work:

```bash
git clone <your-fork-url>
git checkout -b feat/short-description
```

2. Run the app locally

Backend (Go):

```bash
cd server
go mod download
go run main.go
```

Frontend (client):

```bash
cd client
npm install
npm run dev
```

Coding guidelines

- Keep changes focused and small — one logical change per pull request.
- Follow existing code style and patterns (TypeScript + React conventions in
  `client/`, idiomatic Go in `server/`).
- Run linters and fix warnings before opening a PR:

```bash
cd client
npm run lint
```

Pull request process

- Push your branch to your fork and open a pull request against `main`.
- Provide a clear description of your change and any steps required to test it.
- If your change affects runtime behavior, include manual test steps or a
  short demonstration video/gif in the PR description.

Report bugs

- Open an issue with a short title and reproduction steps. Include expected vs
  actual behavior and any relevant logs or screenshots.

License

By contributing you agree that your contributions will be licensed under the
project's MIT license.

Thank you for helping improve ClipItUp!
