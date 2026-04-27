/**
 * Extract the user ID from a Bolt request body.
 * Handles both `body.user.id` (actions, views) and `body.user_id` (shortcuts).
 * @param {Object} body - The full Bolt request body
 * @returns {string} The user's Slack ID
 */
export function getUserId(body) {
	return body.user?.id ?? body.user_id;
}

/**
 * Post an ephemeral error message to the user.
 * @param {Object} client - Slack WebClient
 * @param {string} userId - The user's Slack ID
 * @param {string} [text] - Optional custom message text
 * @returns {Promise<void>}
 */
export async function postEphemeralError(
	client,
	userId,
	text = "Something went wrong — please try again.",
) {
	await client.chat.postEphemeral({
		channel: userId,
		user: userId,
		text: `:warning: ${text}`,
	});
}
