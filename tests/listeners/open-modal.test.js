import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import esmock from "esmock";

describe("viewJourneyCallback", () => {
	let viewJourneyCallback;
	let stateModule;

	afterEach(() => {
		stateModule?.resetGame("U_PLAYER");
	});

	async function setup() {
		stateModule = await import("../../game/state.js");
		stateModule.resetGame("U_PLAYER");
		({ viewJourneyCallback } = await esmock("../../listeners/actions/open-modal.js", {
			"../../game/state.js": stateModule,
		}));
	}

	function buildClient() {
		return {
			views: { open: mock.fn(async () => ({})) },
		};
	}

	it("acknowledges the action", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await viewJourneyCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
	});

	it("opens the journey log modal", async () => {
		await setup();
		stateModule.startGame("U_PLAYER");
		stateModule.advanceState("U_PLAYER", "investigate_alert");

		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await viewJourneyCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(client.views.open.mock.calls.length, 1);
		const call = client.views.open.mock.calls[0].arguments[0];
		assert.equal(call.trigger_id, "T_TRIGGER");
		assert.equal(call.view.type, "modal");
		assert.equal(call.view.title.text, "Journey Log");
	});

	it("uses starting node when no game state exists", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await viewJourneyCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(client.views.open.mock.calls.length, 1);
	});

	it("logs error on views.open failure", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = {
			views: {
				open: mock.fn(async () => {
					throw new Error("trigger_expired");
				}),
			},
			chat: { postEphemeral: mock.fn(async () => ({})) },
		};
		const logger = { error: mock.fn() };

		await viewJourneyCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(logger.error.mock.calls.length, 1);
		assert.ok(logger.error.mock.calls[0].arguments[0].includes("trigger_expired"));
	});
});

describe("helpCallback", () => {
	let helpCallback;

	async function setup() {
		({ helpCallback } = await esmock("../../listeners/actions/open-modal.js", {
			"../../game/state.js": await import("../../game/state.js"),
		}));
	}

	function buildClient() {
		return {
			views: { open: mock.fn(async () => ({})) },
		};
	}

	it("acknowledges the action", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await helpCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(ack.mock.calls.length, 1);
	});

	it("opens the help modal", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = buildClient();
		const logger = { error: mock.fn() };

		await helpCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(client.views.open.mock.calls.length, 1);
		const call = client.views.open.mock.calls[0].arguments[0];
		assert.equal(call.view.type, "modal");
		assert.equal(call.view.title.text, "How to Play");
	});

	it("logs error on views.open failure", async () => {
		await setup();
		const ack = mock.fn(async () => {});
		const client = {
			views: {
				open: mock.fn(async () => {
					throw new Error("modal_error");
				}),
			},
			chat: { postEphemeral: mock.fn(async () => ({})) },
		};
		const logger = { error: mock.fn() };

		await helpCallback({
			ack,
			body: { user: { id: "U_PLAYER" }, trigger_id: "T_TRIGGER" },
			client,
			logger,
		});

		assert.equal(logger.error.mock.calls.length, 1);
	});
});
