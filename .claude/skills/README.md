# Project Skills

Claude Code skills for developing the Block Kit Adventure app. These are project-scoped — they're available when working in this repo.

## Available Skills

| Skill | Description | Invocation |
|---|---|---|
| **scaffold** | Generate a new story scene or Bolt listener with tests | `/scaffold scene the database corrupts` or `/scaffold listener actions vote-scene` |
| **validate-blocks** | Check Block Kit output against Slack's spec constraints | `/validate-blocks` or `/validate-blocks game/renderer.js` |
| **playtest** | Trace story paths to proofread narrative flow | `/playtest` or `/playtest mentor_fix` |
| **slack-api** | Quick reference for Slack API methods and Block Kit elements | `/slack-api chat.update` or `/slack-api section block` |
| **size-it** | Classify task size and constrain effort — small/medium/large | `/size-it add a restart button to endings` |

## Invocation Modes

- **scaffold** is manual-only (`disable-model-invocation: true`) — invoke with `/scaffold`
- **validate-blocks**, **playtest**, **slack-api**, and **size-it** can also be triggered automatically by Claude when relevant

## Learn More

- [Claude Code Skills docs](https://code.claude.com/docs/en/skills)
