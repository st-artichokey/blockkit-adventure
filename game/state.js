import { STARTING_NODE_ID } from "../story/nodes.js";

/**
 * @typedef {Object} GameState
 * @property {string[]} choiceHistory - Node IDs visited in order
 * @property {string} messageTs - Timestamp of the current game message
 * @property {string} channelId - Channel (DM) where the game is being played
 * @property {Record<string, string>} formData - User-provided form inputs keyed by stateKey
 */

/** @type {Map<string, GameState>} */
const gameStates = new Map();

/**
 * Start a new game for a user.
 * @param {string} userId - Slack user ID
 * @returns {GameState} The initial game state
 */
export function startGame(userId) {
	const state = {
		choiceHistory: [STARTING_NODE_ID],
		messageTs: "",
		channelId: "",
		formData: {},
	};
	gameStates.set(userId, state);
	return state;
}

/**
 * Get the current game state for a user.
 * @param {string} userId - Slack user ID
 * @returns {GameState | undefined} The game state, or undefined if no game in progress
 */
export function getState(userId) {
	return gameStates.get(userId);
}

/**
 * Advance the game to a new node.
 * @param {string} userId - Slack user ID
 * @param {string} nextNodeId - The node to advance to
 * @returns {GameState} The updated game state
 */
export function advanceState(userId, nextNodeId) {
	const state = gameStates.get(userId);
	if (!state) {
		return startGame(userId);
	}
	state.choiceHistory.push(nextNodeId);
	return state;
}

/**
 * Update the message reference for a user's game.
 * @param {string} userId - Slack user ID
 * @param {string} channelId - Channel ID
 * @param {string} messageTs - Message timestamp
 */
export function setMessageRef(userId, channelId, messageTs) {
	const state = gameStates.get(userId);
	if (state) {
		state.channelId = channelId;
		state.messageTs = messageTs;
	}
}

/**
 * Escape mrkdwn formatting characters by wrapping them with zero-width spaces.
 * Prevents user input from being rendered as Slack formatting.
 * @param {string} text - Raw user input
 * @returns {string} Escaped text safe for mrkdwn contexts
 */
function escapeMrkdwn(text) {
	return text.replace(/([*_~`>])/g, "\u200B$1\u200B");
}

/**
 * Store a form input value in the game state.
 * Trims whitespace and escapes mrkdwn characters before storing.
 * @param {string} userId - Slack user ID
 * @param {string} key - The form data key (matches formInput.stateKey)
 * @param {string} value - The user-provided text
 */
export function setFormData(userId, key, value) {
	const state = gameStates.get(userId);
	if (state) {
		state.formData[key] = escapeMrkdwn(value.trim());
	}
}

/**
 * Get all stored form data for a user's game.
 * @param {string} userId - Slack user ID
 * @returns {Record<string, string>} The form data, or empty object
 */
export function getFormData(userId) {
	const state = gameStates.get(userId);
	return state?.formData ?? {};
}

/**
 * Reset the game for a user.
 * @param {string} userId - Slack user ID
 */
export function resetGame(userId) {
	gameStates.delete(userId);
}
