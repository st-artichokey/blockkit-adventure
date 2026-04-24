/**
 * Extract the user ID from a Bolt request body.
 * Handles both `body.user.id` (actions, views) and `body.user_id` (shortcuts).
 * @param {Object} body - The full Bolt request body
 * @returns {string} The user's Slack ID
 */
export function getUserId(body) {
	return body.user?.id ?? body.user_id;
}
