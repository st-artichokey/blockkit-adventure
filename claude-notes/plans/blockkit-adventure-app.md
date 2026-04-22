# Plan: Block Kit Choose Your Own Adventure Slack App

## Context
Create a new JavaScript Slack Bolt app that demonstrates Block Kit UI through a choose-your-own-adventure game. Based on official Slack docs patterns (docs.slack.dev), not existing local repos. The game presents story scenarios using Block Kit components and branches based on user choices.

## Approach

### Game design
- Story is a directed graph of nodes — each has narrative text + 1–3 button choices
- Each choice leads to another node or an ending
- Per-user state tracked in-memory (current node, choice history)
- Game starts via global shortcut or App Home button
- Story renders as a DM message with Block Kit blocks + action buttons
- On choice: update the existing message (chat.update) with the next node
- Endings show summary of path taken + "Play Again" button

### Theme: "The Lost Deploy"
Developer-themed adventure: a production deploy goes wrong at 4:59 PM Friday. ~15 story nodes, 3+ endings.

### Block Kit elements demonstrated
- Header block — scene titles
- Section block with mrkdwn — narrative text
- Context block — status/progress info
- Divider block — visual separation
- Actions block with buttons — player choices (primary/danger styles)

## Implementation steps

### Step 1: Project scaffolding
- `package.json` — ESM, Bolt v4, dotenv, Biome, esmock
- `app.js` — Bolt init with Socket Mode, register listeners, start
- `manifest.json` — shortcuts, events, scopes, socket mode
- `.env.sample`, `.gitignore`, `biome.json`

### Step 2: Story graph and game logic
- `story/nodes.js` — STORY_NODES object + STARTING_NODE_ID
- `game/state.js` — Per-user Map: startGame, getState, advanceState, resetGame, setMessageRef
- `game/renderer.js` — buildStoryBlocks(node, history), buildEndingBlocks(node, history)

### Step 3: Listeners
- `listeners/index.js` — registerListeners(app)
- `listeners/actions/adventure-choice.js` — ack, advance state, chat.update
- `listeners/events/app-home-opened.js` — views.publish home tab
- `listeners/shortcuts/start-adventure.js` — ack, start game, send DM

### Step 4: Tests
- `tests/story/nodes.test.js` — graph integrity
- `tests/game/state.test.js` — state management
- `tests/game/renderer.test.js` — block structure
- `tests/listeners/adventure-choice.test.js` — handler behavior

## Files created

| File | Purpose |
|---|---|
| `app.js` | Entry point |
| `manifest.json` | Slack app config |
| `package.json` | Dependencies and scripts |
| `story/nodes.js` | Story graph data |
| `game/state.js` | Per-user game state |
| `game/renderer.js` | Block Kit builders |
| `listeners/index.js` | Central registration |
| `listeners/actions/index.js` + `adventure-choice.js` | Button handlers |
| `listeners/events/index.js` + `app-home-opened.js` | Home tab |
| `listeners/shortcuts/index.js` + `start-adventure.js` | Global shortcut |
| `tests/**/*.test.js` | 4 test suites, 30 tests |

## Verification
1. `npm install` succeeds
2. `npm run lint` passes
3. `npm test` — all 30 tests pass
4. Story graph validation confirms no broken links
