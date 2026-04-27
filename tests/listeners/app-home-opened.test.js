import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { appHomeOpenedCallback } from "../../listeners/events/app-home-opened.js";

describe("appHomeOpenedCallback", () => {
	it("publishes the App Home view for the user", async () => {
		const client = { views: { publish: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		await appHomeOpenedCallback({
			event: { user: "U_PLAYER" },
			client,
			logger,
		});

		assert.equal(client.views.publish.mock.calls.length, 1);
		const call = client.views.publish.mock.calls[0].arguments[0];
		assert.equal(call.user_id, "U_PLAYER");
		assert.equal(call.view.type, "home");
	});

	it("includes the start adventure button", async () => {
		const client = { views: { publish: mock.fn(async () => ({})) } };
		const logger = { error: mock.fn() };

		await appHomeOpenedCallback({
			event: { user: "U_PLAYER" },
			client,
			logger,
		});

		const view = client.views.publish.mock.calls[0].arguments[0].view;
		const buttons = view.blocks
			.filter((b) => b.type === "section" && b.accessory)
			.map((b) => b.accessory);
		const startButton = buttons.find((b) => b.action_id === "start_adventure_home");
		assert.ok(startButton, "expected start_adventure_home button");
		assert.equal(startButton.style, "primary");
	});

	it("logs error on views.publish failure", async () => {
		const client = {
			views: {
				publish: mock.fn(async () => {
					throw new Error("publish_failed");
				}),
			},
		};
		const logger = { error: mock.fn() };

		await appHomeOpenedCallback({
			event: { user: "U_PLAYER" },
			client,
			logger,
		});

		assert.equal(logger.error.mock.calls.length, 1);
		assert.ok(logger.error.mock.calls[0].arguments[0].includes("publish_failed"));
	});
});
