# Contributing

For setup instructions, see the [Quick Start](README.md#quick-start) in the README.

## Code Conventions

- **ESM modules** — `"type": "module"` in package.json
- **Tabs for indentation** — enforced by Biome
- **camelCase** for functions, **UPPER_SNAKE_CASE** for constants
- **JSDoc** on all exported functions with `@param` and `@returns` tags

## Linting

Run [Biome](https://biomejs.dev) before committing:

```sh
npm run lint        # check for issues
npm run lint:fix    # auto-fix issues
```

## Testing

Tests use the Node.js built-in test runner with [esmock](https://github.com/iambumblehead/esmock) for module mocking. We follow TDD: write tests first, verify they fail, then implement.

```sh
npm test
```

- Mirror the source structure in `tests/` (e.g., `game/state.js` → `tests/game/state.test.js`)
- One behavior per `it()` block, named descriptively
- Test both happy paths and error cases

## Adding Story Content

The story graph lives in `story/nodes.js`. Read the file for the full node schema. Key guidelines:

- 1-3 choices per node with short, consequence-hinting button labels
- Ending summaries should reflect on the journey, not just the outcome
- Use Slack emoji syntax (`:emoji_name:`), not Unicode
- Tests validate graph integrity — all links resolve, no orphan nodes, endings have summaries

## Adding Listeners

1. Create the handler in `listeners/<type>/` (actions, events, or shortcuts)
2. Export a named function with the `Callback` suffix (e.g., `voteSceneCallback`)
3. Register it in the category's `index.js`
4. `await ack()` first in action/shortcut handlers; wrap API calls in try/catch with `logger.error()`
5. Add a test in `tests/listeners/`

## Block Kit

Key constraints — or run `/validate-blocks` to check automatically:

- Messages: max 50 blocks. Header text: max 150 chars. Section text: max 3,000 chars
- Include a `text` fallback alongside `blocks` in `chat.postMessage` / `chat.update`
- Use `style: "primary"` for recommended actions, `"danger"` for risky ones

## Submitting Changes

1. Create a feature branch from `main`
2. Ensure `npm run lint` and `npm test` pass
3. One feature or fix per PR, with a clear description of what and why

## Contributing with AI (Claude Code)

This project includes [Claude Code skills](.claude/skills/README.md) for AI-assisted development. The [skills README](.claude/skills/README.md) covers what's available and recommended workflows.

Key points:

- **Use `/size-it` before tasks** to match effort to complexity
- **Run `/validate-blocks` after modifying Block Kit output** and `/playtest` after editing story content
- **Reference `/slack-api`** for API details rather than relying on training data
- `CLAUDE.md` applies project conventions automatically — no need to repeat them in prompts
