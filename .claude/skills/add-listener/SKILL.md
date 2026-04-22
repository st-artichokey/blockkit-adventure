---
name: add-listener
description: Scaffold a new Bolt listener with registration, handler file, and test — following this project's exact patterns
argument-hint: "<type> <name>"
arguments: type name
disable-model-invocation: true
allowed-tools: Read Write Edit Glob
---

# Add Listener — Bolt Listener Scaffolder

Generate a new listener following this project's conventions: handler file, index registration, and test file.

## Input

- `$type` — listener category: `actions`, `events`, or `shortcuts`
- `$name` — listener name in kebab-case (e.g., `vote-scene`, `reaction-added`)

If either argument is missing, ask before proceeding.

## Steps

### 1. Read existing patterns

Read these files to match the exact style:
- `listeners/$type/index.js` — how listeners are registered
- One existing handler in `listeners/$type/` — for the handler file pattern
- One existing test in `tests/listeners/` — for the test file pattern

### 2. Create the handler file

Create `listeners/$type/$name.js`:

```js
/**
 * Handle the <description> <type>.
 * @param {Object} params - Bolt <type> handler arguments
 * @param {Function} params.ack - Acknowledge function
 * @param {Object} params.body - The full request body
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function <camelCaseName>Callback({ ack, body, client, logger }) {
	await ack();

	try {
		// TODO: Implement handler logic
	} catch (error) {
		logger.error(`<Description> error: ${error.message}`);
	}
}
```

Adjust the destructured parameters based on type:
- **actions**: include `action` parameter
- **events**: include `event` instead of `ack` (events don't need acknowledgment)
- **shortcuts**: include `shortcut` parameter

### 3. Update the index file

Edit `listeners/$type/index.js` to:
- Import the new callback
- Add the registration call inside the `register` function

Registration patterns by type:
- **actions**: `app.action("<action_id>", callback)` or `app.action(/^pattern_/, callback)`
- **events**: `app.event("<event_name>", callback)`
- **shortcuts**: `app.shortcut("<callback_id>", callback)`

Use the `$name` converted to snake_case as the action_id/event_name/callback_id.

### 4. Create the test file

Create `tests/listeners/$name.test.js`:

```js
import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";
import esmock from "esmock";

function buildClient() {
	return {
		chat: {
			postMessage: mock.fn(async () => ({ channel: "D_DM", ts: "111.222" })),
			update: mock.fn(async () => ({})),
		},
	};
}

describe("<camelCaseName>Callback", () => {
	let <camelCaseName>Callback;

	beforeEach(async () => {
		({ <camelCaseName>Callback } = await esmock(
			"../../listeners/$type/$name.js",
			{}
		));
	});

	it("acknowledges the interaction", async () => {
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await <camelCaseName>Callback({
			ack,
			body: { user: { id: "U_TEST" } },
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
	});
});
```

Skip the `ack` test for event listeners (they don't acknowledge).

### 5. Verify

Run `npm test` to confirm the new test passes and existing tests still pass.

## Naming conventions

- File names: kebab-case (`vote-scene.js`)
- Callback exports: camelCase + Callback suffix (`voteSceneCallback`)
- Action IDs / event names: snake_case (`vote_scene`)
