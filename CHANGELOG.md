# Changelog

## 2026-04-22

### Added
- About tab content via `long_description` in manifest — describes the game, how to play, and what to expect
- Initial project scaffolding: Bolt v4, Socket Mode, ESM, Biome, Node.js test runner
- "The Lost Deploy" story graph — 13 nodes, 6 endings, branching paths
- Game engine: per-user state management, Block Kit renderer, in-place message updates
- Listeners: adventure choice actions, App Home tab, global shortcut
- 30 tests across 5 suites (story integrity, state, renderer, listener)
- README, CONTRIBUTING, and claude-notes documentation
- 5 Claude Code skills: scaffold, validate-blocks, playtest, slack-api, size-it
- CLAUDE.md with project conventions for Claude Code
- Annotated `.env.sample` with token guidance

- Skill test fixtures and manual test guide (`tests/SKILL-TESTS.md`, `tests/fixtures/bad-renderer.js`)

### Tested
- Manual end-to-end testing of all 5 Claude Code skills (`/size-it`, `/scaffold`, `/validate-blocks`, `/playtest`, `/slack-api`)
- `/playtest` full-graph trace identified `ignore_alert` as a 2-step path (below 3-step pacing guideline)

### Changed
- Manifest: rewrote `long_description` for developer audience learning Block Kit; updated `description` to lead with learning value
- Manifest: added `commands` bot scope (required for global shortcuts)
- Manifest: added `app_directory` section with placeholder Marketplace links
- App Home: added Block Kit documentation and Block Kit Builder links to Home tab
- Skills README: added first-time setup note about restarting Claude Code for skill discovery
- Refined all documentation for brevity, accuracy, and accessibility
- Skills README rewritten with explainer for new users, recommended workflow
- CONTRIBUTING AI section condensed; links to skills README instead of duplicating table
