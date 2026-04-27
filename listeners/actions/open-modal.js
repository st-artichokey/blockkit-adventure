import { buildHelpModal, buildJourneyLogModal } from "../../game/modals.js";
import { getState } from "../../game/state.js";
import { STARTING_NODE_ID } from "../../story/nodes.js";
import { getUserId } from "../helpers.js";

/**
 * Handle the "View Journey" button — open a modal showing the player's path.
 * @param {Object} params - Bolt action handler arguments
 * @param {Function} params.ack - Acknowledge function
 * @param {Object} params.body - The full request body
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function viewJourneyCallback({ ack, body, client, logger }) {
	await ack();

	const userId = getUserId(body);
	const state = getState(userId);
	const choiceHistory = state?.choiceHistory ?? [STARTING_NODE_ID];

	try {
		await client.views.open({
			trigger_id: body.trigger_id,
			view: buildJourneyLogModal(choiceHistory),
		});
	} catch (error) {
		logger.error(`View Journey modal error: ${error.message}`);
	}
}

/**
 * Handle the "Help" button — open a modal explaining how to play.
 * @param {Object} params - Bolt action handler arguments
 * @param {Function} params.ack - Acknowledge function
 * @param {Object} params.body - The full request body
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function helpCallback({ ack, body, client, logger }) {
	await ack();

	try {
		await client.views.open({
			trigger_id: body.trigger_id,
			view: buildHelpModal(),
		});
	} catch (error) {
		logger.error(`Help modal error: ${error.message}`);
	}
}
