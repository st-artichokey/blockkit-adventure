# Changelog

## 2026-04-24

### Added
- Form input node type: new `formInput` property on story nodes collects text input via a modal
- `buildFormInputModal()` in `game/modals.js` — modal with `plain_text_input` block and `view_submission` callback
- `listeners/actions/open-form.js` — action handler to open the form input modal from a button click
- `listeners/views/form-submit.js` — `view_submission` handler that stores input, advances state, and updates the message
- `listeners/views/index.js` — view listener registration
- Template resolution in renderer: `{{key}}` placeholders in node text/summary are replaced with form data
- `setFormData()` and `getFormData()` in `game/state.js` for per-user form data storage
- New story node `postmortem_complete` — ending that displays the player's custom post-mortem title
- 24 new tests across 5 files (79 total)

### Changed
- `postmortem_tonight` converted from ending node to form input node (asks player to title their post-mortem)
- `buildStoryBlocks()` and `buildEndingBlocks()` accept optional `formData` parameter for template resolution
- Story graph tests updated: "non-ending nodes have choices or formInput", orphan detection includes `formInput.nextNodeId`
- `adventureChoiceCallback` passes `formData` to renderers
- `setFormData()` escapes mrkdwn characters (`*`, `_`, `~`, `` ` ``, `>`) with zero-width spaces and trims whitespace
- `formSubmitCallback` rejects whitespace-only input with a `view_submission` validation error before advancing state
- Mixed actions block: nodes with both `formInput` and `choices` render form button + choice buttons together (cancel escape hatch)
- Enriched form modals: optional `modalHeader`, `modalFlavorText`, and `modalHint` fields add header, section, and context blocks to modals
- Second form input path: `mentor_fix` now collects a message to Alex (demos form input on independent path with different modal flavor)
- 3 new story nodes: `postmortem_skipped` (skip post-mortem ending), `mentor_fix_complete` (encouraging DM ending), `mentor_fix_quick` (quick thanks ending)
- Emoji hint in placeholder: `:fire:` in post-mortem placeholder, `:star:` in Alex message placeholder
- `buildChoiceButton()` extracted as reusable helper in renderer
- Story now has 17 nodes and 8 endings (was 14 nodes, 6 endings)
- 7 new tests (90 total)

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
