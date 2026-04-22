import { STARTING_NODE_ID } from "../story/nodes.js";

/**
 * @typedef {Object} GameState
 * @property {string} currentNodeId - The current story node
 * @property {string[]} choiceHistory - Node IDs visited in order
 * @property {string} messageTs - Timestamp of the current game message
 * @property {string} channelId - Channel (DM) where the game is being played
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
		currentNodeId: STARTING_NODE_ID,
		choiceHistory: [STARTING_NODE_ID],
		messageTs: "",
		channelId: "",
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
	state.currentNodeId = nextNodeId;
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
 * Reset the game for a user.
 * @param {string} userId - Slack user ID
 */
export function resetGame(userId) {
	gameStates.delete(userId);
}
