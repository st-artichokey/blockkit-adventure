# Project Skills

Claude Code skills for developing the Block Kit Adventure app. These are project-scoped — they're available when working in this repo.

## Available Skills

| Skill | Description | Invocation |
|---|---|---|
| **add-scene** | Scaffold a new story node with correct shape and graph wiring | `/add-scene the database starts corrupting data` |
| **validate-blocks** | Check Block Kit output against Slack's spec constraints | `/validate-blocks` or `/validate-blocks game/renderer.js` |
| **add-listener** | Generate a listener, index registration, and test file | `/add-listener actions vote-scene` |
| **playtest** | Trace story paths to proofread narrative flow | `/playtest` or `/playtest mentor_fix` |
| **slack-api** | Quick reference for Slack API methods and Block Kit elements | `/slack-api chat.update` or `/slack-api section block` |
| **size-it** | Classify task size and constrain effort — small/medium/large | `/size-it add a restart button to endings` |

## Usage

Type `/` in Claude Code to see available skills, or invoke directly:

```
/add-scene a scene where the monitoring dashboard starts showing false positives
/add-listener events reaction-added
/validate-blocks
/playtest postmortem_tonight
/slack-api button element
```

## Invocation Modes

- **add-scene** and **add-listener** are manual-only (`disable-model-invocation: true`) — you must invoke them with `/name`
- **validate-blocks**, **playtest**, **slack-api**, and **size-it** can also be triggered automatically by Claude when relevant to your request

## Learn More

- [Claude Code Skills docs](https://code.claude.com/docs/en/skills)
