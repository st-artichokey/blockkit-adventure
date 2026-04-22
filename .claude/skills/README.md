# Project Skills

## What are skills?

Skills are reusable instructions that teach [Claude Code](https://code.claude.com) how to perform project-specific tasks. Instead of explaining "here's how to add a story scene" every time, you invoke `/scaffold scene` and Claude follows the exact steps, matching your project's patterns automatically.

Skills live in this folder (`.claude/skills/`) and load only when needed.

> **Note:** Skills require [Claude Code](https://code.claude.com). Without it, these files are inert markdown. The rest of the project works fine without them.

## Available Skills

| Skill | What it does | How to use |
|---|---|---|
| **scaffold** | Generates story scenes or Bolt listeners with wiring and tests | Type `/scaffold` — manual only |
| **validate-blocks** | Checks Block Kit output against Slack's spec limits | Type `/validate-blocks` or Claude uses it when relevant |
| **playtest** | Traces story paths to proofread narrative and flag issues | Type `/playtest` or Claude uses it when relevant |
| **slack-api** | Fetches concise API reference from official Slack docs | Type `/slack-api` or Claude uses it when relevant |
| **size-it** | Classifies task complexity and matches effort accordingly | Type `/size-it` or Claude uses it when relevant |

### Scaffold subcommands

| Subcommand | What it creates | Example |
|---|---|---|
| `scene` | A new story node in `story/nodes.js` wired into the graph | `/scaffold scene the server room catches fire` |
| `listener` | A handler file, index registration, and test file | `/scaffold listener events reaction-added` |

## Recommended workflow

For adding new content, these skills work best in sequence:

1. **`/size-it`** — set the right effort level
2. **`/scaffold`** — generate the scene or listener
3. **`/playtest`** — check narrative flow across affected paths
4. **`/validate-blocks`** — verify spec compliance
5. **`/slack-api`** — look up API details as needed

Not every task needs all five — a typo fix only needs `/size-it`.

## Learn More

- [Claude Code](https://code.claude.com)
- [Skills documentation](https://code.claude.com/docs/en/skills)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
