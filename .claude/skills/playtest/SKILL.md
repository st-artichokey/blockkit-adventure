---
name: playtest
description: Trace story paths through the adventure game for proofreading — shows narrative flow, choices, and endings
argument-hint: "[ending-node-id]"
allowed-tools: Read
---

# Playtest — Story Path Tracer

Walk through the story graph to proofread narrative flow and preview the player experience.

## Input

`$ARGUMENTS` is an optional ending node ID. If provided, traces the shortest path to that ending. If omitted, lists all endings and traces a path to each.

## Steps

1. **Read** `story/nodes.js`. If an ending is specified and doesn't exist, list available endings and ask.

2. **Find shortest path(s)** from `STARTING_NODE_ID` to the target ending(s) using BFS.

3. **Output each path** as:

   ```
   --- Path to: <ending title> (<node ID>) ---

   [Step 1] <node title>
   <first 150 chars of narrative>...
     > Choice taken: "<button text>"

   [Step N] <ending title> :emoji:
   <full narrative text>

   ENDING: <summary>
   Total steps: N
   ```

4. **Flag issues** after the walkthrough (not inline):
   - **Tone breaks** between connected nodes
   - **Dead references** to characters/events not yet introduced
   - **Pacing** — paths shorter than 3 steps or longer than 7
   - **Button clarity** — vague labels that don't hint at consequences
