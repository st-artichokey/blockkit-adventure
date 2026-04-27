import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";
import esmock from "esmock";

describe("openFormCallback", () => {
	let openFormCallback;

	beforeEach(async () => {
		({ openFormCallback } = await esmock("../../listeners/actions/open-form.js"));
	});

	it("acknowledges the action", async () => {
		const ack = mock.fn(async () => {});
		const client = { views: { open: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		await openFormCallback({
			ack,
			action: { value: "postmortem_tonight" },
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
	});

	it("opens a modal via client.views.open", async () => {
		const ack = mock.fn(async () => {});
		const client = { views: { open: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		await openFormCallback({
			ack,
			action: { value: "postmortem_tonight" },
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(client.views.open.mock.calls.length, 1);
	});

	it("passes the correct trigger_id", async () => {
		const ack = mock.fn(async () => {});
		const client = { views: { open: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		await openFormCallback({
			ack,
			action: { value: "postmortem_tonight" },
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		const openCall = client.views.open.mock.calls[0].arguments[0];
		assert.equal(openCall.trigger_id, "T_TRIGGER");
	});

	it("modal has callback_id adventure_form_submit", async () => {
		const ack = mock.fn(async () => {});
		const client = { views: { open: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		await openFormCallback({
			ack,
			action: { value: "postmortem_tonight" },
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		const openCall = client.views.open.mock.calls[0].arguments[0];
		assert.equal(openCall.view.callback_id, "adventure_form_submit");
	});

	it("logs error for unknown node", async () => {
		const ack = mock.fn(async () => {});
		const client = {
			views: { open: mock.fn(async () => ({})) },
			chat: { postEphemeral: mock.fn(async () => ({})) },
		};
		const logger = { error: mock.fn() };

		await openFormCallback({
			ack,
			action: { value: "nonexistent_node" },
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(logger.error.mock.calls.length, 1);
		assert.ok(logger.error.mock.calls[0].arguments[0].includes("nonexistent_node"));
	});
});
