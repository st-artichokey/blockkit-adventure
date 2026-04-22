# Plan: Project-Scoped Claude Code Skills

## Context
Build 5 skills (plus size-it) in `.claude/skills/` within the blockkit-adventure repo to streamline development. Each skill follows Claude Code's SKILL.md format with YAML frontmatter and markdown instructions, per the official docs at code.claude.com/docs/en/skills.

## Approach

### Skill design principles
- Each skill targets one repetitive workflow in this repo
- `disable-model-invocation: true` for action skills (add-scene, add-listener) — user must invoke explicitly
- Auto-invocable for reference/validation skills (validate-blocks, playtest, slack-api, size-it)
- `allowed-tools` pre-approves only the tools each skill needs
- `$ARGUMENTS` for user input; named arguments where positional parsing is needed

## Skills

### `/add-scene` — Story Builder
Scaffolds new story nodes with correct shape, wires choices from existing nodes, runs graph integrity tests to validate. Enforces node ID conventions and narrative voice.

### `/validate-blocks` — Block Kit Validator
Checks renderer output against Slack spec constraints: block counts, text lengths, required fields, element limits. Can fetch docs.slack.dev for latest constraints.

### `/add-listener` — Listener Scaffolder
Takes `<type> <name>` args, generates handler file + index registration + test file following project patterns exactly. Adjusts destructured params by listener type.

### `/playtest` — Story Path Tracer
Traces paths through the story graph using BFS. Shows narrative excerpts, choices taken, and ending summaries. Flags pacing, tone, and clarity issues.

### `/slack-api` — Quick Reference
Fetches docs.slack.dev for a specific API method or Block Kit element. Returns a concise reference card: required fields, constraints, code example, gotchas.

### `/size-it` — Task Effort Classifier
Copied from personal skills. Classifies tasks as small/medium/large and constrains Claude's effort accordingly.

## Files created

| File | Purpose |
|---|---|
| `.claude/skills/add-scene/SKILL.md` | Story node scaffolder |
| `.claude/skills/validate-blocks/SKILL.md` | Block Kit validator |
| `.claude/skills/add-listener/SKILL.md` | Listener scaffolder |
| `.claude/skills/playtest/SKILL.md` | Path tracer |
| `.claude/skills/slack-api/SKILL.md` | API reference lookup |
| `.claude/skills/size-it/SKILL.md` | Task effort classifier |
| `.claude/skills/README.md` | Skills overview and usage |

## Verification
1. Each SKILL.md has valid YAML frontmatter
2. Skills appear in Claude Code's `/` autocomplete
3. README documents all 6 skills with invocation examples
