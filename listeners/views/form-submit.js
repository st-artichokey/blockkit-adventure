import { buildEndingBlocks, buildStoryBlocks } from "../../game/renderer.js";
import { advanceState, getFormData, getState, setFormData } from "../../game/state.js";
import { STORY_NODES } from "../../story/nodes.js";

/**
 * Handle form input modal submission — store the input and advance the game.
 * @param {Object} params - Bolt view_submission handler arguments
 * @param {Function} params.ack - Acknowledge function
 * @param {Object} params.body - The full request body
 * @param {Object} params.view - The submitted view payload
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function formSubmitCallback({ ack, body, view, client, logger }) {
	const inputValue = view.state.values.form_input_block.form_input_value.value;

	if (!inputValue.trim()) {
		await ack({
			response_action: "errors",
			errors: { form_input_block: "Please enter a response — it can't be only spaces." },
		});
		return;
	}

	await ack();

	const userId = body.user.id;
	const { stateKey, nextNodeId } = JSON.parse(view.private_metadata);

	const state = getState(userId);
	if (!state) {
		logger.error(`Form submit error: no game state for user "${userId}"`);
		return;
	}

	try {
		setFormData(userId, stateKey, inputValue);
		advanceState(userId, nextNodeId);

		const node = STORY_NODES[nextNodeId];
		const updatedState = getState(userId);
		const formData = getFormData(userId);

		const blocks = node.isEnding
			? buildEndingBlocks(node, updatedState.choiceHistory, formData)
			: buildStoryBlocks(node, updatedState.choiceHistory, formData);

		await client.chat.update({
			channel: state.channelId,
			ts: state.messageTs,
			blocks,
			text: node.title,
		});
	} catch (error) {
		logger.error(`Form submit error: ${error.message}`);
	}
}
