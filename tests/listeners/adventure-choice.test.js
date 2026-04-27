import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";
import esmock from "esmock";
import { STARTING_NODE_ID } from "../../story/nodes.js";

/**
 * Build a mock Slack client.
 * @returns {Object} Mock client with chat.postMessage and chat.update
 */
function buildClient() {
	return {
		chat: {
			postMessage: mock.fn(async () => ({ channel: "D_DM", ts: "111.222" })),
			update: mock.fn(async () => ({})),
			postEphemeral: mock.fn(async () => ({})),
		},
	};
}

describe("adventureChoiceCallback", () => {
	let adventureChoiceCallback;
	let stateModule;

	beforeEach(async () => {
		stateModule = await import("../../game/state.js");
		stateModule.resetGame("U_PLAYER");

		({ adventureChoiceCallback } = await esmock("../../listeners/actions/adventure-choice.js", {
			"../../game/state.js": stateModule,
		}));
	});

	it("acknowledges the action", async () => {
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");

		await adventureChoiceCallback({
			ack,
			action: { action_id: "adventure_choice_check_logs", value: "check_logs" },
			body: { user: { id: "U_PLAYER" }, channel: { id: "D_DM" }, message: { ts: "111.222" } },
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
	});

	it("updates the message with the next story node", async () => {
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");

		await adventureChoiceCallback({
			ack,
			action: { action_id: "adventure_choice_check_logs", value: "check_logs" },
			body: { user: { id: "U_PLAYER" }, channel: { id: "D_DM" }, message: { ts: "111.222" } },
			client,
			logger,
		});

		assert.equal(client.chat.update.mock.calls.length, 1);
		const updateCall = client.chat.update.mock.calls[0].arguments[0];
		assert.equal(updateCall.channel, "D_DM");
		assert.equal(updateCall.ts, "111.222");
		assert.ok(updateCall.blocks.length > 0);
	});

	it("posts a new message on play again", async () => {
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");

		await adventureChoiceCallback({
			ack,
			action: { action_id: "adventure_play_again", value: undefined },
			body: { user: { id: "U_PLAYER" }, channel: { id: "D_DM" }, message: { ts: "111.222" } },
			client,
			logger,
		});

		assert.equal(client.chat.postMessage.mock.calls.length, 1);
		const postCall = client.chat.postMessage.mock.calls[0].arguments[0];
		assert.equal(postCall.channel, "U_PLAYER");
	});

	it("logs error for unknown node", async () => {
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");

		await adventureChoiceCallback({
			ack,
			action: { action_id: "adventure_choice_nonexistent", value: "nonexistent" },
			body: { user: { id: "U_PLAYER" }, channel: { id: "D_DM" }, message: { ts: "111.222" } },
			client,
			logger,
		});

		assert.equal(logger.error.mock.calls.length, 1);
		assert.ok(logger.error.mock.calls[0].arguments[0].includes("nonexistent"));
	});
});
