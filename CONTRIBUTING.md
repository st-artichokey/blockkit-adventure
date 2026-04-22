# Contributing

This guide covers conventions and best practices for contributing, both manually and with AI-assisted workflows.

For setup instructions, see the [Quick Start](README.md#quick-start) in the README.

## Code Conventions

- **ESM modules** — `"type": "module"` in package.json
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

- **Write tests first** when possible — verify they fail, then implement
- Mirror the source structure in `tests/` (e.g., `game/state.js` → `tests/game/state.test.js`)
- One behavior per `it()` block, named descriptively
- Test both happy paths and error cases

## Adding Story Content

The story graph lives in `story/nodes.js`. Each node has:

- `id` — must match the object key
- `title` — scene heading (header block)
- `text` — narrative in mrkdwn format
- `choices` — array of `{ text, nextNodeId, style? }` (omit for endings)
- `isEnding` / `summary` / `emoji` — for terminal nodes

Guidelines:
- 1–3 choices per node with short, consequence-hinting button labels
- Ending summaries should reflect on the journey, not just the outcome
- Use Slack emoji syntax (`:emoji_name:`), not Unicode
- Run `npm test` after every edit — the test suite validates graph integrity

## Adding Listeners

New listeners follow a consistent pattern:

1. Create the handler in `listeners/<type>/` (actions, events, or shortcuts)
2. Export a named function with the `Callback` suffix (e.g., `voteSceneCallback`)
3. Register it in the category's `index.js`
4. `await ack()` first in action/shortcut handlers; wrap API calls in try/catch with `logger.error()`
5. Add a test in `tests/listeners/`

## Block Kit

Key constraints to keep in mind — or run `/validate-blocks` to check automatically:

- Messages: max 50 blocks. Header text: max 150 chars. Section text: max 3,000 chars
- Include a `text` fallback alongside `blocks` in `chat.postMessage` / `chat.update`
- Use `style: "primary"` for recommended actions, `"danger"` for risky ones

## Submitting Changes

1. Create a feature branch from `main`
2. Ensure `npm run lint` and `npm test` pass
3. One feature or fix per PR, with a clear description of what and why

## Contributing with AI (Claude Code)

This project includes [Claude Code skills](https://code.claude.com/docs/en/skills) in `.claude/skills/` for AI-assisted development.

| Skill | What it does | Usage |
|---|---|---|
| `/add-scene` | Scaffolds a new story node with correct shape and wiring | `/add-scene the server room catches fire` |
| `/validate-blocks` | Checks Block Kit output against Slack's spec constraints | `/validate-blocks` |
| `/add-listener` | Generates a listener, index registration, and test file | `/add-listener actions vote-scene` |
| `/playtest` | Traces story paths for proofreading narrative flow | `/playtest mentor_fix` |
| `/slack-api` | Quick reference for Slack API methods and Block Kit elements | `/slack-api chat.update` |
| `/size-it` | Classifies task size and constrains effort accordingly | `/size-it add a restart counter` |

### AI workflow tips

- **Use `/size-it` before tasks** to match effort to complexity
- **Run `/validate-blocks` after modifying Block Kit output** and `/playtest` after editing story content
- **Reference `/slack-api`** for API details rather than relying on training data
- **Keep changes focused** — don't let the AI refactor beyond the scope of the task
- The project's `CLAUDE.md` applies conventions automatically in Claude Code — no need to repeat them in prompts
