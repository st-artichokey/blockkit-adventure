# Contributing

Thanks for your interest in contributing to Block Kit Adventure! This guide covers how to set up the project for development and submit changes.

## Getting Started

1. Fork and clone the repository
2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy the environment template and add your Slack tokens:

   ```sh
   cp .env.sample .env
   ```

4. Start the app in development:

   ```sh
   npm start
   ```

## Code Conventions

- **ESM modules** — the project uses `"type": "module"` in package.json
- **Tabs for indentation** — enforced by Biome
- **camelCase** for functions, **UPPER_SNAKE_CASE** for constants
- **JSDoc** on all exported functions with `@param` and `@returns` tags

## Linting

We use [Biome](https://biomejs.dev) for linting and formatting. Run it before committing:

```sh
npm run lint        # check for issues
npm run lint:fix    # auto-fix issues
```

## Testing

Tests use the Node.js built-in test runner with [esmock](https://github.com/iambumblehead/esmock) for module mocking.

```sh
npm test
```

When adding new features:

- Add tests alongside your implementation
- Place test files in `tests/` mirroring the source structure (e.g., `game/state.js` → `tests/game/state.test.js`)
- Use `mock.fn()` from `node:test` for mock functions and `esmock` for module-level mocking

## Adding Story Content

The story graph lives in `story/nodes.js`. Each node has:

- `id` — unique identifier (used as the object key)
- `title` — scene heading displayed in the header block
- `text` — narrative text in mrkdwn format
- `choices` — array of `{ text, nextNodeId, style? }` (omit for endings)
- `isEnding` / `summary` / `emoji` — for terminal nodes

The test suite (`tests/story/nodes.test.js`) validates graph integrity — all links resolve, no orphan nodes, all endings have summaries. Run tests after editing the story to catch broken links.

## Listener Organization

Listeners are organized by type under `listeners/`:

```
listeners/
├── index.js           # Registers all listener categories
├── actions/           # Interactive component handlers (buttons, menus)
├── events/            # Event subscriptions (app_home_opened)
└── shortcuts/         # Global and message shortcuts
```

Each category has an `index.js` that calls `register(app)`. New listeners should follow this pattern.

## Submitting Changes

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `npm run lint` and `npm test` pass
4. Open a pull request with a clear description of what changed and why
