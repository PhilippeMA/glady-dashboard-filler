# CLAUDE.md

Project rules for coding assistants and human contributors.

## What this is

A Gladys Assistant **external integration** of type `provider` (Node 22+, ESM,
no build step), built from the official JavaScript template. It serves one
dashboard widget, `spacer`, a blank card that keeps an otherwise empty
dashboard column. Its only runtime dependency is
[`@gladysassistant/integration-sdk`](https://github.com/GladysAssistant/integration-sdk-js).

## Commands

```bash
npm install
npm test               # node --test
npm run lint           # ESLint
npm run format:check   # Prettier, as the CI runs it
npm run format         # Prettier, fix in place
npx github:GladysAssistant/integration-store .   # store admission checks
```

The CI runs `format:check`, `lint` and `test` on Node 22 and 24, and builds
the Docker image: run the three commands before pushing.

## Rules

- **Keys are forever.** The widget key `spacer` and its settings keys
  (`height`, `text`) live in the users' dashboards: never rename them.
- **The blank content must stay non-empty.** An empty `components` array
  renders the core's empty state; whitespace is trimmed away by the core.
  `test/widgets.test.js` pins this.
- **Versions belong to the Release workflow.** Never edit `version` in
  `package.json` or the manifest, nor the `docker_image` tag, by hand.
- **Changelog.** Every user-visible change adds a line under
  `## [Unreleased]` in `CHANGELOG.md`.
- **User-facing text** is bilingual (English and French): manifest texts and
  `docs/en.md` / `docs/fr.md`, kept in sync.
- **Style.** Prettier formats, ESLint catches mistakes. Comments explain why,
  in English. Tests never touch the network.
