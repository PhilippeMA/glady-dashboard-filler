# Dashboard Filler — Gladys Assistant integration

An external integration for [Gladys Assistant](https://gladysassistant.com)
that provides an **empty dashboard widget**.

## Why

Gladys does not render the empty columns of a dashboard: an empty column is
editor scaffolding, and the filled columns share the whole width. Configure
three columns, put widgets in only one, and that one takes the full row.

Drop the **Empty space** widget of this integration in the columns that
should stay empty: they are kept, and the dashboard shows exactly the number
of columns chosen in the editor.

| Widget key | Label (en / fr)           | Settings                                            |
| ---------- | ------------------------- | --------------------------------------------------- |
| `spacer`   | Empty space / Espace vide | `height` (1–20 lines, default 1), `text` (optional) |

User documentation: [`docs/en.md`](./docs/en.md) / [`docs/fr.md`](./docs/fr.md).

## How it works

The manifest declares the `provider` type (no device, widgets only, **Gladys
5.1.0 or later**) and one widget. Gladys always draws the card frame and
header of an integration widget; the integration controls its content only:

- an empty `components` array is not blank — Gladys renders it as its
  "Nothing to display yet" empty state;
- so the content is a single `body` text made of **zero-width spaces**
  (U+200B), one per line of the `height` setting. The core strips control
  characters and trims whitespace, but U+200B is neither: the line is kept and
  renders invisible. The optional `text` setting takes the first line.

The content only depends on the per-box settings, so it is cached by the core
for an hour (`ttl_seconds: 3600`).

```
index.js                          SDK bootstrap: registerHandlers + connect
src/app.js                        SDK wiring (onWidgetGet, connection status)
src/widgets.js                    the spacer widget content
gladys-assistant-integration.json manifest
docs/en.md, docs/fr.md            user documentation, re-hosted by Gladys
test/                             node --test, against the SDK's fake Gladys
```

Built from the official
[JavaScript integration template](https://github.com/GladysAssistant/integration-template-js)
with the [`@gladysassistant/integration-sdk`](https://github.com/GladysAssistant/integration-sdk-js).

## Development

```bash
npm install
npm test               # node --test
npm run lint           # ESLint
npm run format:check   # Prettier
```

Run it against a local Gladys:

```bash
GLADYS_HOST_API_URL="http://localhost:1443" \
GLADYS_INTEGRATION_TOKEN="<token>" \
GLADYS_INTEGRATION_SELECTOR="dashboard-filler" \
LOG_LEVEL=debug \
npm start
```

Check the store rules before publishing:

```bash
npx github:GladysAssistant/integration-store .
```

## Publishing

1. Add the GitHub topic `gladys-assistant-integration` to the repository.
2. Describe the changes under `## [Unreleased]` in [`CHANGELOG.md`](CHANGELOG.md).
3. **Actions → Release → Run workflow**, pick `patch`, `minor` or `major`: the
   workflow bumps the versions, tags, builds the multi-arch image to
   `ghcr.io/philippema/glady-dashboard-filler` and publishes the GitHub
   Release.
4. Make the GHCR package public so Gladys can pull it.

Replace `cover.png` (800×534 px, ≤ 150 KB) with your own cover before
publishing: the current one is the template's placeholder.

## License

Apache-2.0
