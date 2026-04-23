import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEndingBlocks, buildStoryBlocks } from "../../game/renderer.js";

describe("buildStoryBlocks", () => {
	const node = {
		id: "test_node",
		title: "Test Scene",
		text: "Something happens.",
		choices: [
			{ text: "Option A", nextNodeId: "node_a", style: "primary" },
			{ text: "Option B", nextNodeId: "node_b" },
		],
	};

	it("returns header, section, divider, actions (choices), actions (modal buttons), and context blocks", () => {
		const blocks = buildStoryBlocks(node, ["start", "test_node"]);
		const types = blocks.map((b) => b.type);
		assert.deepEqual(types, ["header", "section", "divider", "actions", "actions", "context"]);
	});

	it("header contains the node title", () => {
		const blocks = buildStoryBlocks(node, ["test_node"]);
		assert.equal(blocks[0].text.text, "Test Scene");
	});

	it("section contains the narrative text", () => {
		const blocks = buildStoryBlocks(node, ["test_node"]);
		assert.equal(blocks[1].text.text, "Something happens.");
		assert.equal(blocks[1].text.type, "mrkdwn");
	});

	it("action buttons have correct action_ids and values", () => {
		const blocks = buildStoryBlocks(node, ["test_node"]);
		const actions = blocks[3];
		assert.equal(actions.elements.length, 2);
		assert.equal(actions.elements[0].action_id, "adventure_choice_node_a");
		assert.equal(actions.elements[0].value, "node_a");
		assert.equal(actions.elements[1].action_id, "adventure_choice_node_b");
	});

	it("applies button style when specified", () => {
		const blocks = buildStoryBlocks(node, ["test_node"]);
		const actions = blocks[3];
		assert.equal(actions.elements[0].style, "primary");
		assert.equal(actions.elements[1].style, undefined);
	});

	it("attaches confirm dialog when choice has confirmText", () => {
		const nodeWithConfirm = {
			...node,
			choices: [
				{ text: "Risky move", nextNodeId: "node_a", style: "danger", confirmText: "Are you sure?" },
				{ text: "Safe move", nextNodeId: "node_b", style: "primary" },
			],
		};
		const blocks = buildStoryBlocks(nodeWithConfirm, ["test_node"]);
		const actions = blocks[3];
		const dangerButton = actions.elements[0];
		const safeButton = actions.elements[1];

		assert.ok(dangerButton.confirm, "danger button with confirmText should have confirm");
		assert.equal(dangerButton.confirm.title.text, "Are you sure?");
		assert.equal(dangerButton.confirm.title.type, "plain_text");
		assert.equal(dangerButton.confirm.confirm.type, "plain_text");
		assert.equal(dangerButton.confirm.deny.type, "plain_text");
		assert.equal(
			safeButton.confirm,
			undefined,
			"button without confirmText should have no confirm",
		);
	});

	it("includes View Journey and Help buttons", () => {
		const blocks = buildStoryBlocks(node, ["test_node"]);
		const modalActions = blocks[4];
		assert.equal(modalActions.elements.length, 2);
		assert.equal(modalActions.elements[0].action_id, "adventure_view_journey");
		assert.equal(modalActions.elements[1].action_id, "adventure_help");
	});

	it("context shows the step count", () => {
		const blocks = buildStoryBlocks(node, ["a", "b", "test_node"]);
		assert.ok(blocks[5].elements[0].text.includes("Step 3"));
	});
});

describe("buildEndingBlocks", () => {
	const endingNode = {
		id: "the_end",
		title: "The End",
		text: "You made it.",
		isEnding: true,
		summary: "A great ending.",
		emoji: ":trophy:",
	};

	it("returns header, section, divider, summary section, context, divider, actions", () => {
		const blocks = buildEndingBlocks(endingNode, ["start", "the_end"]);
		const types = blocks.map((b) => b.type);
		assert.deepEqual(types, [
			"header",
			"section",
			"divider",
			"section",
			"context",
			"divider",
			"actions",
		]);
	});

	it("header includes the emoji", () => {
		const blocks = buildEndingBlocks(endingNode, ["the_end"]);
		assert.ok(blocks[0].text.text.includes(":trophy:"));
	});

	it("summary section contains the ending summary", () => {
		const blocks = buildEndingBlocks(endingNode, ["the_end"]);
		assert.ok(blocks[3].text.text.includes("A great ending."));
	});

	it("play again button has correct action_id", () => {
		const blocks = buildEndingBlocks(endingNode, ["the_end"]);
		const actions = blocks[6];
		assert.equal(actions.elements[0].action_id, "adventure_play_again");
	});

	it("ending actions include a Help button", () => {
		const blocks = buildEndingBlocks(endingNode, ["the_end"]);
		const actions = blocks[6];
		assert.equal(actions.elements.length, 2);
		assert.equal(actions.elements[1].action_id, "adventure_help");
	});

	it("uses fallback emoji when node has none", () => {
		const noEmojiNode = { ...endingNode, emoji: undefined };
		const blocks = buildEndingBlocks(noEmojiNode, ["the_end"]);
		assert.ok(blocks[0].text.text.includes(":checkered_flag:"));
	});
});
