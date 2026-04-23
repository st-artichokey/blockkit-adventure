import { STORY_NODES } from "../story/nodes.js";

/**
 * Build Block Kit blocks for a story node with choices.
 * @param {import('../story/nodes.js').StoryNode} node - The story node to render
 * @param {string[]} choiceHistory - Node IDs visited so far
 * @returns {import('@slack/bolt').Block[]} Block Kit blocks array
 */
export function buildStoryBlocks(node, choiceHistory) {
	const blocks = [
		{
			type: "header",
			text: { type: "plain_text", text: node.title, emoji: true },
		},
		{
			type: "section",
			text: { type: "mrkdwn", text: node.text },
		},
		{ type: "divider" },
	];

	if (node.choices) {
		blocks.push({
			type: "actions",
			elements: node.choices.map((choice) => {
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
			}),
		});
	}

	blocks.push({
		type: "actions",
		elements: [
			{
				type: "button",
				text: { type: "plain_text", text: ":scroll: View Journey", emoji: true },
				action_id: "adventure_view_journey",
			},
			{
				type: "button",
				text: { type: "plain_text", text: ":question: Help", emoji: true },
				action_id: "adventure_help",
			},
		],
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
 * @returns {import('@slack/bolt').Block[]} Block Kit blocks array
 */
export function buildEndingBlocks(node, choiceHistory) {
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
			text: { type: "mrkdwn", text: node.text },
		},
		{ type: "divider" },
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `*Ending:* ${node.summary}`,
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
				{
					type: "button",
					text: { type: "plain_text", text: ":question: Help", emoji: true },
					action_id: "adventure_help",
				},
			],
		},
	];
}
