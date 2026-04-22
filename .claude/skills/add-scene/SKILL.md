---
name: add-scene
description: Scaffold a new story node in the adventure game graph with correct shape and wiring
argument-hint: "<description of the scene to add>"
disable-model-invocation: true
allowed-tools: Read Grep Edit Bash
---

# Add Scene — Story Node Scaffolder

Add a new story node to `story/nodes.js` and wire it into the existing graph.

## Input

`$ARGUMENTS` describes the scene. It may include:
- A scene concept (e.g., "the server room catches fire")
- Which existing node(s) should link to it (e.g., "add as a choice from check_logs")
- Whether it's an ending (e.g., "this is a bad ending")

If the input is ambiguous, ask for clarification before proceeding.

## Steps

1. **Read** `story/nodes.js` to understand the current graph structure and node IDs.

2. **Generate the node** with this exact shape:

   ```js
   node_id: {
       id: "node_id",
       title: "Scene Title",
       text: "Narrative text in mrkdwn format...",
       choices: [
           { text: "Button label", nextNodeId: "existing_or_new_id", style: "primary" },
           { text: "Another choice", nextNodeId: "another_id" },
       ],
   },
   ```

   For endings, omit `choices` and add:
   ```js
   isEnding: true,
   summary: "One-sentence summary of this ending.",
   emoji: ":relevant_emoji:",
   ```

3. **Node ID rules:**
   - Use snake_case, descriptive, max 30 characters
   - The `id` field must match the object key exactly

4. **Wire it in:**
   - Add the node to the `STORY_NODES` object in `story/nodes.js`
   - If the user specified a parent node, add a choice to that parent pointing to the new node
   - Ensure every new non-ending node's choices point to existing nodes or other new nodes

5. **Validate** by running:
   ```bash
   npm test -- --test-name-pattern="Story graph"
   ```
   This checks: all links resolve, no orphan nodes, endings have summaries, required fields present.

6. **Fix** any test failures before finishing.

## Constraints

- Match the existing code style (tabs, mrkdwn in text, Slack emoji syntax)
- Keep narrative text engaging and in the voice of "The Lost Deploy" theme
- Choices should have 1-3 options with clear, concise button labels
- Use `style: "primary"` for the recommended/safe choice and `style: "danger"` for risky choices
