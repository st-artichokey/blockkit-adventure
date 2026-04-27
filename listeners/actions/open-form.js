import { buildFormInputModal } from "../../game/modals.js";
import { STORY_NODES } from "../../story/nodes.js";
import { getUserId, postEphemeralError } from "../helpers.js";

/**
 * Handle the "open form" button — open a modal for text input on a form input node.
 * @param {Object} params - Bolt action handler arguments
 * @param {Function} params.ack - Acknowledge function
 * @param {Object} params.action - The action payload
 * @param {Object} params.body - The full request body
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function openFormCallback({ ack, action, body, client, logger }) {
	await ack();

	const userId = getUserId(body);
	const nodeId = action.value;
	const node = STORY_NODES[nodeId];

	if (!node?.formInput) {
		logger.error(`Open form error: node "${nodeId}" not found or has no formInput`);
		await postEphemeralError(client, userId);
		return;
	}

	try {
		await client.views.open({
			trigger_id: body.trigger_id,
			view: buildFormInputModal(node.formInput, nodeId),
		});
	} catch (error) {
		logger.error(`Open form modal error: ${error.message}`);
		await postEphemeralError(client, userId);
	}
}
