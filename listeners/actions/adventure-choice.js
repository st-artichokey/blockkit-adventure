import { buildEndingBlocks, buildStoryBlocks } from "../../game/renderer.js";
import { getUserId } from "../helpers.js";
import { advanceState, getFormData, setMessageRef, startGame } from "../../game/state.js";
import { STARTING_NODE_ID, STORY_NODES } from "../../story/nodes.js";

/**
 * Handle adventure choice button clicks and "Play Again".
 * @param {Object} params - Bolt action handler arguments
 * @param {Function} params.ack - Acknowledge function
 * @param {Object} params.action - The action payload
 * @param {Object} params.body - The full request body
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function adventureChoiceCallback({ ack, action, body, client, logger }) {
	await ack();

	const userId = getUserId(body);
	const channelId = body.channel?.id;
	const messageTs = body.message?.ts;

	try {
		if (action.action_id === "adventure_play_again") {
			const state = startGame(userId);
			const firstNode = STORY_NODES[STARTING_NODE_ID];
			const blocks = buildStoryBlocks(firstNode, state.choiceHistory);

			const result = await client.chat.postMessage({
				channel: userId,
				blocks,
				text: firstNode.title,
			});

			setMessageRef(userId, result.channel, result.ts);
			return;
		}

		const nextNodeId = action.value;
		const node = STORY_NODES[nextNodeId];

		if (!node) {
			logger.error(`Unknown story node: ${nextNodeId}`);
			return;
		}

		const state = advanceState(userId, nextNodeId);
		const formData = getFormData(userId);
		const blocks = node.isEnding
			? buildEndingBlocks(node, state.choiceHistory, formData)
			: buildStoryBlocks(node, state.choiceHistory, formData);

		await client.chat.update({
			channel: channelId,
			ts: messageTs,
			blocks,
			text: node.title,
		});
	} catch (error) {
		logger.error(`Adventure choice error: ${error.message}`);
	}
}
