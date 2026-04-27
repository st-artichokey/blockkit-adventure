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

describe("buildStoryBlocks with imageUrl", () => {
	const imageNode = {
		id: "img_node",
		title: "Scene With Image",
		text: "Look at this.",
		imageUrl: "https://example.com/image.png",
		imageAlt: "A descriptive alt text",
		choices: [{ text: "Continue", nextNodeId: "next" }],
	};

	it("includes an image block between section and divider", () => {
		const blocks = buildStoryBlocks(imageNode, ["img_node"]);
		const types = blocks.map((b) => b.type);
		assert.deepEqual(types, [
			"header",
			"section",
			"image",
			"divider",
			"actions",
			"actions",
			"context",
		]);
	});

	it("image block has correct url and alt text", () => {
		const blocks = buildStoryBlocks(imageNode, ["img_node"]);
		const imageBlock = blocks.find((b) => b.type === "image");
		assert.equal(imageBlock.image_url, "https://example.com/image.png");
		assert.equal(imageBlock.alt_text, "A descriptive alt text");
	});

	it("falls back to node title for alt text when imageAlt is missing", () => {
		const nodeWithoutAlt = { ...imageNode, imageAlt: undefined };
		const blocks = buildStoryBlocks(nodeWithoutAlt, ["img_node"]);
		const imageBlock = blocks.find((b) => b.type === "image");
		assert.equal(imageBlock.alt_text, "Scene With Image");
	});

	it("does not include image block when imageUrl is absent", () => {
		const nodeWithoutImage = {
			id: "no_img",
			title: "Plain",
			text: "No image.",
			choices: [{ text: "Go", nextNodeId: "x" }],
		};
		const blocks = buildStoryBlocks(nodeWithoutImage, ["no_img"]);
		assert.ok(!blocks.some((b) => b.type === "image"));
	});
});

describe("buildEndingBlocks with imageUrl", () => {
	const endingWithImage = {
		id: "img_ending",
		title: "Image Ending",
		text: "You did it.",
		isEnding: true,
		summary: "Great job.",
		emoji: ":trophy:",
		imageUrl: "https://example.com/ending.png",
		imageAlt: "Victory",
	};

	it("includes an image block in ending", () => {
		const blocks = buildEndingBlocks(endingWithImage, ["start", "img_ending"]);
		const imageBlock = blocks.find((b) => b.type === "image");
		assert.ok(imageBlock);
		assert.equal(imageBlock.image_url, "https://example.com/ending.png");
		assert.equal(imageBlock.alt_text, "Victory");
	});
});

describe("buildStoryBlocks with formInput", () => {
	const formNode = {
		id: "form_node",
		title: "Write Something",
		text: "Time to write your response.",
		formInput: {
			label: "Your title",
			placeholder: "Enter a title",
			buttonText: ":memo: Write Title",
			buttonStyle: "primary",
			nextNodeId: "next_node",
			stateKey: "myTitle",
		},
	};

	it("renders a single form button when node has formInput", () => {
		const blocks = buildStoryBlocks(formNode, ["form_node"]);
		const actions = blocks[3];
		assert.equal(actions.elements.length, 1);
		assert.equal(actions.elements[0].type, "button");
	});

	it("form input button has action_id adventure_open_form", () => {
		const blocks = buildStoryBlocks(formNode, ["form_node"]);
		const button = blocks[3].elements[0];
		assert.equal(button.action_id, "adventure_open_form");
	});

	it("form input button value is the node id", () => {
		const blocks = buildStoryBlocks(formNode, ["form_node"]);
		const button = blocks[3].elements[0];
		assert.equal(button.value, "form_node");
	});

	it("form input button uses the buttonText and buttonStyle", () => {
		const blocks = buildStoryBlocks(formNode, ["form_node"]);
		const button = blocks[3].elements[0];
		assert.equal(button.text.text, ":memo: Write Title");
		assert.equal(button.style, "primary");
	});
});

describe("buildStoryBlocks with formInput + choices (mixed actions)", () => {
	const mixedNode = {
		id: "mixed_node",
		title: "Mixed Actions",
		text: "You can fill the form or skip it.",
		formInput: {
			label: "Your title",
			placeholder: "Enter a title",
			buttonText: ":memo: Write Title",
			buttonStyle: "primary",
			nextNodeId: "next_node",
			stateKey: "myTitle",
		},
		choices: [{ text: "Skip it", nextNodeId: "skip_node" }],
	};

	it("renders form button and choice buttons in a single actions block", () => {
		const blocks = buildStoryBlocks(mixedNode, ["mixed_node"]);
		const actions = blocks[3];
		assert.equal(actions.elements.length, 2);
	});

	it("form button comes first, choice buttons follow", () => {
		const blocks = buildStoryBlocks(mixedNode, ["mixed_node"]);
		const actions = blocks[3];
		assert.equal(actions.elements[0].action_id, "adventure_open_form");
		assert.equal(actions.elements[1].action_id, "adventure_choice_skip_node");
	});

	it("form button retains its style and value", () => {
		const blocks = buildStoryBlocks(mixedNode, ["mixed_node"]);
		const formBtn = blocks[3].elements[0];
		assert.equal(formBtn.style, "primary");
		assert.equal(formBtn.value, "mixed_node");
		assert.equal(formBtn.text.text, ":memo: Write Title");
	});
});

describe("template resolution", () => {
	const templateNode = {
		id: "tmpl_node",
		title: "Template Node",
		text: "You wrote: *{{myTitle}}*",
		choices: [{ text: "Continue", nextNodeId: "next" }],
	};

	it("resolves template placeholders in story node text", () => {
		const blocks = buildStoryBlocks(templateNode, ["tmpl_node"], { myTitle: "Bug Report" });
		assert.equal(blocks[1].text.text, "You wrote: *Bug Report*");
	});

	it("leaves text unchanged when no formData provided", () => {
		const blocks = buildStoryBlocks(templateNode, ["tmpl_node"]);
		assert.equal(blocks[1].text.text, "You wrote: *{{myTitle}}*");
	});

	it("resolves template placeholders in ending text and summary", () => {
		const endNode = {
			id: "end",
			title: "Done",
			text: 'Title: "{{myTitle}}"',
			isEnding: true,
			summary: 'Wrote "{{myTitle}}"',
			emoji: ":trophy:",
		};
		const blocks = buildEndingBlocks(endNode, ["end"], { myTitle: "Outage Fix" });
		assert.equal(blocks[1].text.text, 'Title: "Outage Fix"');
		assert.ok(blocks[3].text.text.includes('Wrote "Outage Fix"'));
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
