import { buildStoryBlocks } from "../../game/renderer.js";
import { setMessageRef, startGame } from "../../game/state.js";
import { STARTING_NODE_ID, STORY_NODES } from "../../story/nodes.js";

/**
 * Handle the start_adventure shortcut and App Home button.
 * Starts a new game and sends the first scene as a DM.
 * @param {Object} params - Bolt shortcut/action handler arguments
 * @param {Function} params.ack - Acknowledge function
 * @param {Object} params.body - The full request body
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function startAdventureCallback({ ack, body, client, logger }) {
	await ack();

	const userId = body.user.id ?? body.user_id;

	try {
		const state = startGame(userId);
		const firstNode = STORY_NODES[STARTING_NODE_ID];
		const blocks = buildStoryBlocks(firstNode, state.choiceHistory);

		const result = await client.chat.postMessage({
			channel: userId,
			blocks,
			text: firstNode.title,
		});

		setMessageRef(userId, result.channel, result.ts);
	} catch (error) {
		logger.error(`Start adventure error: ${error.message}`);
	}
}
