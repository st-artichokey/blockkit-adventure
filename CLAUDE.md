# blockkit-adventure

A Slack Bolt app demonstrating Block Kit UI through a choose-your-own-adventure game.

## Commit Conventions

- Update `CHANGELOG.md` with a summary entry **before every commit** — include it in the same commit.
- Update the session log in `claude-notes/logs/session-YYYY-MM-DD.md` in the same commit as the changelog update.
- Session log format follows the template in `claude-notes/logs/session-2026-04-22.md`:
  - H2 sections group related work; each user prompt becomes an H3 header
  - Under each prompt: description of what was done, then a **Sources** section with linked references
  - End with a **Stats** section (branch, commits, test count, files modified)
  - End with a thematic GIF (200px, from Giphy)

## Code Conventions

- ESM modules (`"type": "module"` in package.json)
- **TDD:** write or update tests first, verify they fail, then implement
- JSDoc on all exported functions with `@param` and `@returns` tags
- camelCase for functions, UPPER_SNAKE_CASE for constants
- Biome for linting (`npm run lint`) — auto-fix formatting issues without asking
- Node.js built-in test runner with `esmock` for mocking
- Listeners organized by type: `listeners/actions/`, `listeners/events/`, `listeners/shortcuts/`

## Story Graph

- Story nodes live in `story/nodes.js` — read this file for the node schema before editing
- Node IDs: snake_case, must match the object key
- Use Slack emoji syntax (`:emoji_name:`), not Unicode

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** @slack/bolt v4
- **Linter:** Biome
- **Testing:** Node.js test runner + esmock
