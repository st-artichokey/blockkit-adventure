import { STORY_NODES } from "../story/nodes.js";

/**
 * Replace {{key}} placeholders in text with values from formData.
 * @param {string} text - Text with optional template placeholders
 * @param {Record<string, string>} formData - Key-value pairs to substitute
 * @returns {string} Text with placeholders resolved
 */
function resolveTemplates(text, formData) {
	return text.replace(/\{\{(\w+)\}\}/g, (match, key) => formData[key] ?? match);
}

/**
 * Build a Block Kit button element from a choice object.
 * @param {import('../story/nodes.js').Choice} choice - The choice to render
 * @returns {Object} Button element
 */
function buildChoiceButton(choice) {
	const button = {
		type: "button",
		text: { type: "plain_text", text: choice.text, emoji: true },
		action_id: `adventure_choice_${choice.nextNodeId}`,
		value: choice.nextNodeId,
	};
	if (choice.style) {
		button.style = choice.style;
	}
	if (choice.confirmText) {
		button.confirm = {
			title: { type: "plain_text", text: choice.confirmText },
			text: { type: "mrkdwn", text: `_${choice.text}_ — this can't be undone.` },
			confirm: { type: "plain_text", text: "Do it" },
			deny: { type: "plain_text", text: "Wait, go back" },
		};
	}
	return button;
}

/**
 * Build a "Help" button element.
 * @returns {Object} Button element
 */
function buildHelpButton() {
	return {
		type: "button",
		text: { type: "plain_text", text: ":question: Help", emoji: true },
		action_id: "adventure_help",
	};
}

/**
 * Build a "View Journey" button element.
 * @returns {Object} Button element
 */
function buildJourneyButton() {
	return {
		type: "button",
		text: { type: "plain_text", text: ":scroll: View Journey", emoji: true },
		action_id: "adventure_view_journey",
	};
}

/**
 * Build Block Kit blocks for a story node with choices.
 * @param {import('../story/nodes.js').StoryNode} node - The story node to render
 * @param {string[]} choiceHistory - Node IDs visited so far
 * @param {Record<string, string>} [formData={}] - User-provided form inputs for template resolution
 * @returns {import('@slack/bolt').Block[]} Block Kit blocks array
 */
export function buildStoryBlocks(node, choiceHistory, formData = {}) {
	const blocks = [
		{
			type: "header",
			text: { type: "plain_text", text: node.title, emoji: true },
		},
		{
			type: "section",
			text: { type: "mrkdwn", text: resolveTemplates(node.text, formData) },
		},
		{ type: "divider" },
	];

	if (node.formInput) {
		const fi = node.formInput;
		const formButton = {
			type: "button",
			text: { type: "plain_text", text: fi.buttonText, emoji: true },
			action_id: "adventure_open_form",
			value: node.id,
		};
		if (fi.buttonStyle) {
			formButton.style = fi.buttonStyle;
		}
		const elements = [formButton];
		if (node.choices) {
			elements.push(...node.choices.map((choice) => buildChoiceButton(choice)));
		}
		blocks.push({ type: "actions", elements });
	} else if (node.choices) {
		blocks.push({
			type: "actions",
			elements: node.choices.map((choice) => buildChoiceButton(choice)),
		});
	}

	blocks.push({
		type: "actions",
		elements: [buildJourneyButton(), buildHelpButton()],
	});

	blocks.push({
		type: "context",
		elements: [
			{
				type: "mrkdwn",
				text: `Step ${choiceHistory.length} · :book: _The Lost Deploy_`,
			},
		],
	});

	return blocks;
}

/**
 * Build Block Kit blocks for an ending node.
 * @param {import('../story/nodes.js').StoryNode} node - The ending node to render
 * @param {string[]} choiceHistory - Complete path of node IDs
 * @param {Record<string, string>} [formData={}] - User-provided form inputs for template resolution
 * @returns {import('@slack/bolt').Block[]} Block Kit blocks array
 */
export function buildEndingBlocks(node, choiceHistory, formData = {}) {
	const pathDescription = choiceHistory
		.map((nodeId) => STORY_NODES[nodeId]?.title ?? nodeId)
		.join(" → ");

	return [
		{
			type: "header",
			text: {
				type: "plain_text",
				text: `${node.emoji ?? ":checkered_flag:"} ${node.title}`,
				emoji: true,
			},
		},
		{
			type: "section",
			text: { type: "mrkdwn", text: resolveTemplates(node.text, formData) },
		},
		{ type: "divider" },
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `*Ending:* ${resolveTemplates(node.summary, formData)}`,
			},
		},
		{
			type: "context",
			elements: [
				{
					type: "mrkdwn",
					text: `*Your path (${choiceHistory.length} steps):*\n${pathDescription}`,
				},
			],
		},
		{ type: "divider" },
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: { type: "plain_text", text: "Play Again", emoji: true },
					action_id: "adventure_play_again",
					style: "primary",
				},
				buildHelpButton(),
			],
		},
	];
}
