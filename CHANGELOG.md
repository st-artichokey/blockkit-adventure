# Changelog

## 2026-04-23

### Added
- Modal views: Journey Log modal (shows player's path) and Help modal (game mechanics)
- `game/modals.js` with `buildJourneyLogModal()` and `buildHelpModal()` builders
- `listeners/actions/open-modal.js` with action handlers for `adventure_view_journey` and `adventure_help`
- "View Journey" and "Help" buttons in story scenes; "Help" button on ending screens
- `docs/blockkit-feature-reference.md` — comprehensive Block Kit feature checklist with implementation status
- 14 new tests for modal builders (46 total)
- `docs/decision-tree.md` — ASCII map of all story branching paths and endings

### Changed
- Restyled button styles using time pressure logic: `danger` = act now without full information, `primary` = take time to investigate, unstyled = neutral. Styles no longer spoil outcomes.
- Confirm dialogs on all danger-styled buttons — prompts like "No time to check?" and "Bypass branch protection?" before impulsive actions
- `im:history` scope, `pricing`, and `supported_languages` added to manifest

## 2026-04-22

### Added
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
- About tab content via `long_description` in manifest
- `app_directory` section with placeholder Marketplace links
- Block Kit documentation and Block Kit Builder links in App Home tab

### Changed
- Manifest: rewrote `long_description` and `description` for developer audience learning Block Kit
- Manifest: added `commands` bot scope (required for global shortcuts)
- Skills README: added first-time setup note, explainer for new users, recommended workflow
- Refined all documentation for brevity, accuracy, and accessibility
- CONTRIBUTING AI section condensed; links to skills README instead of duplicating table

### Tested
- Manual end-to-end testing of all 5 Claude Code skills (`/size-it`, `/scaffold`, `/validate-blocks`, `/playtest`, `/slack-api`)
- `/playtest` full-graph trace identified `ignore_alert` as a 2-step path (below 3-step pacing guideline)
