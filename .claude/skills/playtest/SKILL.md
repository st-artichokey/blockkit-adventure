---
name: playtest
description: Trace story paths through the adventure game for proofreading — shows narrative flow, choices, and endings
argument-hint: "[ending-node-id]"
allowed-tools: Read
---

# Playtest — Story Path Tracer

Walk through the adventure story graph to proofread narrative flow, verify choices make sense, and preview the player experience.

## Input

`$ARGUMENTS` is an optional ending node ID. If provided, traces the shortest path to that ending. If omitted, lists all endings and traces a path to each.

## Steps

### If no ending specified

1. **Read** `story/nodes.js`.

2. **List all endings** in a summary table:

   | Ending | Node ID | Emoji | Summary |
   |---|---|---|---|
   | The title | `node_id` | :emoji: | One-line summary |

3. **Trace a path to each ending** using BFS (shortest path from `STARTING_NODE_ID`). For each path, output the walkthrough format below.

### If ending specified

1. **Read** `story/nodes.js`.
2. **Find shortest path** from `STARTING_NODE_ID` to the specified ending using BFS.
3. If the ending doesn't exist, list available endings and ask which one.

### Walkthrough output format

For each path, output:

```
--- Path to: <ending title> (<ending node ID>) ---

[Step 1] <node title>
<first 150 chars of narrative text>...
  > Choice taken: "<choice button text>"

[Step 2] <node title>
<first 150 chars of narrative text>...
  > Choice taken: "<choice button text>"

...

[Step N] <ending title> :emoji:
<full narrative text>

ENDING: <summary>
Total steps: N
```

### Proofreading checks

While tracing, flag any issues:
- **Tone breaks**: narrative shifts that feel jarring between connected nodes
- **Dead references**: choices mentioning characters or events not introduced yet
- **Pacing**: paths that are very short (< 3 steps) or very long (> 7 steps) to reach an ending
- **Button clarity**: choice labels that are vague or don't hint at consequences

Report issues after the walkthrough, not inline.
