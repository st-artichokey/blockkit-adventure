import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";
import esmock from "esmock";

describe("formSubmitCallback", () => {
	let formSubmitCallback;
	let stateModule;

	beforeEach(async () => {
		stateModule = await import("../../game/state.js");
		stateModule.resetGame("U_PLAYER");

		({ formSubmitCallback } = await esmock("../../listeners/views/form-submit.js", {
			"../../game/state.js": stateModule,
		}));
	});

	const buildView = (overrides = {}) => ({
		private_metadata: JSON.stringify({
			nodeId: "postmortem_tonight",
			stateKey: "postmortemTitle",
			nextNodeId: "postmortem_complete",
		}),
		state: {
			values: {
				form_input_block: {
					form_input_value: { value: "Null pointer in profile endpoint" },
				},
			},
		},
		...overrides,
	});

	it("acknowledges the submission", async () => {
		const ack = mock.fn(async () => {});
		const client = { chat: { update: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");
		stateModule.setMessageRef("U_PLAYER", "D_DM", "111.222");

		await formSubmitCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			view: buildView(),
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
	});

	it("stores the form input in game state", async () => {
		const ack = mock.fn(async () => {});
		const client = { chat: { update: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");
		stateModule.setMessageRef("U_PLAYER", "D_DM", "111.222");

		await formSubmitCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			view: buildView(),
			client,
			logger,
		});

		const formData = stateModule.getFormData("U_PLAYER");
		assert.equal(formData.postmortemTitle, "Null pointer in profile endpoint");
	});

	it("advances to the next node", async () => {
		const ack = mock.fn(async () => {});
		const client = { chat: { update: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");
		stateModule.setMessageRef("U_PLAYER", "D_DM", "111.222");

		await formSubmitCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			view: buildView(),
			client,
			logger,
		});

		const state = stateModule.getState("U_PLAYER");
		assert.ok(state.choiceHistory.includes("postmortem_complete"));
	});

	it("updates the chat message", async () => {
		const ack = mock.fn(async () => {});
		const client = { chat: { update: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");
		stateModule.setMessageRef("U_PLAYER", "D_DM", "111.222");

		await formSubmitCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			view: buildView(),
			client,
			logger,
		});

		assert.equal(client.chat.update.mock.calls.length, 1);
		const updateCall = client.chat.update.mock.calls[0].arguments[0];
		assert.equal(updateCall.channel, "D_DM");
		assert.equal(updateCall.ts, "111.222");
		assert.ok(updateCall.blocks.length > 0);
	});

	it("rejects whitespace-only input with a validation error", async () => {
		const ack = mock.fn(async () => {});
		const client = { chat: { update: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");
		stateModule.setMessageRef("U_PLAYER", "D_DM", "111.222");

		await formSubmitCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			view: buildView({
				state: {
					values: {
						form_input_block: {
							form_input_value: { value: "   " },
						},
					},
				},
			}),
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
		const ackArg = ack.mock.calls[0].arguments[0];
		assert.equal(ackArg.response_action, "errors");
		assert.ok(ackArg.errors.form_input_block);
	});

	it("does not advance state on whitespace-only input", async () => {
		const ack = mock.fn(async () => {});
		const client = { chat: { update: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		stateModule.startGame("U_PLAYER");
		stateModule.setMessageRef("U_PLAYER", "D_DM", "111.222");

		await formSubmitCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			view: buildView({
				state: {
					values: {
						form_input_block: {
							form_input_value: { value: "   " },
						},
					},
				},
			}),
			client,
			logger,
		});

		const state = stateModule.getState("U_PLAYER");
		assert.deepEqual(state.choiceHistory, ["friday_alert"]);
		assert.equal(client.chat.update.mock.calls.length, 0);
	});

	it("logs error when state is missing", async () => {
		const ack = mock.fn(async () => {});
		const client = { chat: { update: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		await formSubmitCallback({
			ack,
			body: { user: { id: "U_PLAYER" } },
			view: buildView(),
			client,
			logger,
		});

		assert.equal(logger.error.mock.calls.length, 1);
	});
});
