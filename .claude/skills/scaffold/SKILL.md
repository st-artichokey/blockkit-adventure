---
name: scaffold
description: Scaffold a new story scene or Bolt listener — generates files, wires registrations, and creates tests
argument-hint: "<scene|listener> <details>"
disable-model-invocation: true
allowed-tools: Read Grep Edit Write Bash Glob
---

# Scaffold

Generate new project components by reading existing patterns and replicating them exactly.

## Input

`$ARGUMENTS` starts with a type keyword:

- **`scene <description>`** — add a story node to `story/nodes.js`
- **`listener <type> <name>`** — add a listener (type: `actions`, `events`, or `shortcuts`)

If arguments are ambiguous or missing, ask before proceeding.

---

## Scene

1. **Read** `story/nodes.js` to understand the current graph and node schema.

2. **Generate a node** matching the existing shape exactly. Read the typedefs in the file for the required fields.
   - Node ID: snake_case, descriptive, max 30 characters — must match the object key
   - Keep narrative in "The Lost Deploy" voice
   - 1–3 choices with short, consequence-hinting button labels
   - Use `style: "primary"` for safe choices, `"danger"` for risky ones

3. **Wire it in:**
   - Add the node to `STORY_NODES`
   - If the user specified a parent, add a choice on that parent pointing to the new node
   - Ensure all `nextNodeId` references resolve

---

## Listener

1. **Read** one existing handler and test in the target category to match the exact patterns.

2. **Create the handler** at `listeners/<type>/<name>.js`:
   - Export a named `<camelCaseName>Callback` function
   - Adjust destructured params by type: `action` for actions, `event` for events, `shortcut` for shortcuts
   - Events don't call `ack()`

3. **Register it** in `listeners/<type>/index.js` — import and add the registration call.
   - Registration: `app.action()` / `app.event()` / `app.shortcut()` with snake_case ID

4. **Create a test** at `tests/listeners/<name>.test.js` matching the existing test patterns (esmock, mock.fn, buildClient helper).
