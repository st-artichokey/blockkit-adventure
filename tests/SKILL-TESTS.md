# Skill Test Guide

Manual test scenarios for each Claude Code skill. Run these in order — each tests a specific capability.

## 1. `/size-it` — Task Classification

**Test:** Should classify as small, skip planning, and edit directly.

```
/size-it rename the STARTING_NODE_ID constant to FIRST_NODE_ID in story/nodes.js
```

**Expected:** Outputs `[effort: small]`, edits the file with no plan mode. (Don't actually commit — revert after.)

---

## 2. `/scaffold scene` — Story Node Scaffolder

**Test:** Should read the graph, generate a matching node, and wire it in.

```
/scaffold scene a mysterious server closet — branch from check_logs
```

**Expected:**
- Reads `story/nodes.js`
- Adds a new node (e.g. `server_closet`) with id, title, text, choices
- Adds a choice on `check_logs` pointing to the new node
- Runs `npm test` — tests pass

---

## 3. `/scaffold listener` — Listener Scaffolder

**Test:** Should create a handler, register it, and create a test.

```
/scaffold listener events reaction-added
```

**Expected:**
- Creates `listeners/events/reaction-added.js` with exported callback
- Updates `listeners/events/index.js` with import and registration
- Creates `tests/listeners/reaction-added.test.js` with esmock setup
- No `ack()` call (events don't ack)

---

## 4. `/validate-blocks` — Block Kit Validator

### 4a. Clean file (should pass)

```
/validate-blocks game/renderer.js
```

**Expected:** "All Block Kit constraints satisfied." (or equivalent pass message)

### 4b. Bad file (should catch violations)

```
/validate-blocks tests/fixtures/bad-renderer.js
```

**Expected:** Flags at least these violations:
- `buildLongHeaderBlocks`: header text > 150 chars
- `buildBadButtonBlocks`: button text > 75 chars
- `buildBadSectionBlocks`: section missing required text/fields
- `buildTooManyBlocks`: > 50 blocks in a message
- `buildBadContextBlocks`: > 10 context elements

---

## 5. `/playtest` — Story Path Tracer

### 5a. Specific ending

```
/playtest mentor_fix
```

**Expected:** BFS path from `friday_alert` to `mentor_fix`, showing each step's title, narrative excerpt, and choice taken. Flags any issues.

### 5b. All endings

```
/playtest
```

**Expected:** Lists all 6 endings with emoji and summary, then traces a path to each.

---

## 6. `/slack-api` — API Reference Lookup

```
/slack-api chat.update
```

**Expected:** Fetches docs.slack.dev, returns a reference card with required fields, constraints, and a code example.

---

## Cleanup

After testing, discard all uncommitted changes:

```sh
git checkout -- .
git clean -fd
```
