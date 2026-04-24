import { STORY_NODES } from "../story/nodes.js";

/**
 * Build a modal view showing the player's journey so far.
 * @param {string[]} choiceHistory - Node IDs visited in order
 * @returns {import('@slack/bolt').ModalView} Modal view object
 */
export function buildJourneyLogModal(choiceHistory) {
	const stepBlocks = choiceHistory.flatMap((nodeId, index) => {
		const node = STORY_NODES[nodeId];
		const title = node?.title ?? nodeId;
		return [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `*Step ${index + 1}:* ${title}`,
				},
			},
		];
	});

	return {
		type: "modal",
		title: {
			type: "plain_text",
			text: "Journey Log",
			emoji: true,
		},
		close: {
			type: "plain_text",
			text: "Close",
			emoji: true,
		},
		blocks: [
			{
				type: "header",
				text: {
					type: "plain_text",
					text: ":scroll: Your Journey So Far",
					emoji: true,
				},
			},
			{ type: "divider" },
			...stepBlocks,
			{ type: "divider" },
			{
				type: "context",
				elements: [
					{
						type: "mrkdwn",
						text: `:footprints: ${choiceHistory.length} step${choiceHistory.length === 1 ? "" : "s"} taken`,
					},
				],
			},
		],
	};
}

/**
 * Build the blocks array for a form input modal, optionally enriched with
 * a header, flavor section, and context hint.
 * @param {import('../story/nodes.js').FormInput} formInput - The form input configuration
 * @returns {Object[]} Block Kit blocks array
 */
function buildFormInputBlocks(formInput) {
	const blocks = [];

	if (formInput.modalHeader) {
		blocks.push({
			type: "header",
			text: { type: "plain_text", text: formInput.modalHeader, emoji: true },
		});
		if (formInput.modalFlavorText) {
			blocks.push({
				type: "section",
				text: {
					type: "mrkdwn",
					text: `_${formInput.modalFlavorText}_`,
				},
			});
		}
		blocks.push({ type: "divider" });
	}

	blocks.push({
		type: "input",
		block_id: "form_input_block",
		label: {
			type: "plain_text",
			text: formInput.label,
			emoji: true,
		},
		element: {
			type: "plain_text_input",
			action_id: "form_input_value",
			placeholder: {
				type: "plain_text",
				text: formInput.placeholder,
				emoji: true,
			},
			max_length: 100,
		},
	});

	if (formInput.modalHint) {
		blocks.push({
			type: "context",
			elements: [
				{
					type: "mrkdwn",
					text: `:bulb: _${formInput.modalHint}_`,
				},
			],
		});
	}

	return blocks;
}

/**
 * Build a modal view with a text input for a form input node.
 * @param {import('../story/nodes.js').FormInput} formInput - The form input configuration
 * @param {string} nodeId - The current node ID (passed via private_metadata for the submission handler)
 * @returns {import('@slack/bolt').ModalView} Modal view object
 */
export function buildFormInputModal(formInput, nodeId) {
	return {
		type: "modal",
		callback_id: "adventure_form_submit",
		private_metadata: JSON.stringify({
			nodeId,
			stateKey: formInput.stateKey,
			nextNodeId: formInput.nextNodeId,
		}),
		title: {
			type: "plain_text",
			text: "Write Your Response",
			emoji: true,
		},
		submit: {
			type: "plain_text",
			text: "Submit",
			emoji: true,
		},
		close: {
			type: "plain_text",
			text: "Cancel",
			emoji: true,
		},
		blocks: buildFormInputBlocks(formInput),
	};
}

/**
 * Build a modal view explaining how to play the adventure game.
 * @returns {import('@slack/bolt').ModalView} Modal view object
 */
export function buildHelpModal() {
	return {
		type: "modal",
		title: {
			type: "plain_text",
			text: "How to Play",
			emoji: true,
		},
		close: {
			type: "plain_text",
			text: "Close",
			emoji: true,
		},
		blocks: [
			{
				type: "header",
				text: {
					type: "plain_text",
					text: ":question: How to Play",
					emoji: true,
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "*The Lost Deploy* is a choose-your-own-adventure game built with Block Kit.\n\nIt's Friday afternoon and a production deploy just failed. Your choices determine the outcome.",
				},
			},
			{ type: "divider" },
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: ':point_right: *Making choices*\nEach scene presents you with buttons. Click one to advance the story. Green buttons mean "take your time," red buttons mean "act now" — but neither guarantees a good outcome.',
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: ":checkered_flag: *Endings*\nThere are multiple ending paths. Some are triumphant, some are cautionary. Try different choices to discover them all.",
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: ":repeat: *Restarting*\nWhen you reach an ending, click *Play Again* to start over with a fresh story. You can also use the */start_adventure* shortcut or the App Home button.",
				},
			},
			{ type: "divider" },
			{
				type: "context",
				elements: [
					{
						type: "mrkdwn",
						text: ":book: _The Lost Deploy_ \u2014 a Block Kit adventure",
					},
				],
			},
		],
	};
}
