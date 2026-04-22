# Block Kit Adventure

A Slack Bolt app that demonstrates Block Kit UI through a choose-your-own-adventure game.

## The Game

**The Lost Deploy** — it's 4:59 PM on a Friday and a production deploy just failed. Your choices determine how the incident plays out. Every path showcases different Block Kit components in action.

- 13 story nodes with branching paths
- 6 unique endings
- Block Kit elements: headers, sections, dividers, action buttons, context blocks

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [Slack workspace](https://slack.com/get-started#/createnew) where you can install apps
- A Slack app configured with Socket Mode (see [Setup](#setup))

## Setup

1. **Create a Slack app**

   Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App** → **From a manifest**. Paste the contents of [`manifest.json`](manifest.json).

2. **Generate tokens**

   - **Bot token** (`xoxb-`): Install the app to your workspace under **OAuth & Permissions**
   - **App-level token** (`xapp-`): Under **Basic Information** → **App-Level Tokens**, create a token with the `connections:write` scope

3. **Configure environment**

   ```sh
   cp .env.sample .env
   ```

   Edit `.env` and add your tokens:

   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_APP_TOKEN=xapp-your-app-level-token
   ```

4. **Install dependencies**

   ```sh
   npm install
   ```

5. **Start the app**

   ```sh
   npm start
   ```

## How to Play

- **Global shortcut**: Search for "Start Adventure" in Slack's search bar
- **App Home**: Open the app's Home tab and click "Start Adventure"

The game sends you a DM with the first scene. Click buttons to make choices — the message updates in place as the story progresses.

## Project Structure

```
blockkit-adventure/
├── app.js                 # Entry point — Bolt init and startup
├── manifest.json          # Slack app manifest
├── story/
│   └── nodes.js           # Story graph (nodes, choices, endings)
├── game/
│   ├── state.js           # Per-user game state management
│   └── renderer.js        # Block Kit block builders
├── listeners/
│   ├── index.js           # Central listener registration
│   ├── actions/           # Button click handlers
│   ├── events/            # App Home opened handler
│   └── shortcuts/         # Global shortcut handler
└── tests/                 # Test suites mirroring app structure
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the app |
| `npm test` | Run tests |
| `npm run lint` | Check code with Biome |
| `npm run lint:fix` | Auto-fix lint and formatting issues |

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: [@slack/bolt](https://docs.slack.dev/bolt-js) v4
- **Linter**: [Biome](https://biomejs.dev)
- **Testing**: Node.js test runner + [esmock](https://github.com/iambumblehead/esmock)

## License

MIT
