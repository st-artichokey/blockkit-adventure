import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import esmock from "esmock";

describe("startAdventureCallback", () => {
	let startAdventureCallback;
	let stateModule;

	afterEach(() => {
		stateModule?.resetGame("U_PLAYER");
	});

	async function setup() {
		stateModule = await import("../../game/state.js");
		stateModule.resetGame("U_PLAYER");
		({ startAdventureCallback } = await esmock("../../listeners/shortcuts/start-adventure.js", {
			"../../game/state.js": stateModule,
		}));
	}

	function buildClient() {
		return {
			chat: {
				postMessage: mock.fn(async () => ({ channel: "D_DM", ts: "111.222" })),
				postEphemeral: mock.fn(async () => ({})),
			},
		};
	}

	it("acknowledges the shortcut", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await startAdventureCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
	});

	it("posts the first story node as a DM", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await startAdventureCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			client,
			logger,
		});

		assert.equal(client.chat.postMessage.mock.calls.length, 1);
		const call = client.chat.postMessage.mock.calls[0].arguments[0];
		assert.equal(call.channel, "U_PLAYER");
		assert.ok(call.blocks.length > 0);
	});

	it("stores the message reference in game state", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await startAdventureCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			client,
			logger,
		});

		const state = stateModule.getState("U_PLAYER");
		assert.equal(state.channelId, "D_DM");
		assert.equal(state.messageTs, "111.222");
	});

	it("posts ephemeral confirmation when triggered from a channel", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await startAdventureCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, channel: { id: "C_GENERAL" } },
			client,
			logger,
		});

		assert.equal(client.chat.postEphemeral.mock.calls.length, 1);
		const call = client.chat.postEphemeral.mock.calls[0].arguments[0];
		assert.equal(call.channel, "C_GENERAL");
		assert.equal(call.user, "U_PLAYER");
	});

	it("does not post ephemeral when triggered from DM", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await startAdventureCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			client,
			logger,
		});

		assert.equal(client.chat.postEphemeral.mock.calls.length, 0);
	});

	it("logs error on failure", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = {
			chat: {
				postMessage: mock.fn(async () => {
					throw new Error("network_error");
				}),
				postEphemeral: mock.fn(async () => ({})),
			},
		};
		const logger = { error: mock.fn() };

		await startAdventureCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			client,
			logger,
		});

		assert.equal(logger.error.mock.calls.length, 1);
	});
});
