import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { advanceState, getState, resetGame, setMessageRef, startGame } from "../../game/state.js";
import { STARTING_NODE_ID } from "../../story/nodes.js";

describe("Game state", () => {
	const userId = "U_TEST_USER";

	beforeEach(() => {
		resetGame(userId);
	});

	it("startGame initializes state at the starting node", () => {
		const state = startGame(userId);
		assert.equal(state.currentNodeId, STARTING_NODE_ID);
		assert.deepEqual(state.choiceHistory, [STARTING_NODE_ID]);
		assert.equal(state.messageTs, "");
		assert.equal(state.channelId, "");
	});

	it("getState returns undefined for unknown users", () => {
		assert.equal(getState("U_UNKNOWN"), undefined);
	});

	it("getState returns the current state after starting", () => {
		startGame(userId);
		const state = getState(userId);
		assert.equal(state.currentNodeId, STARTING_NODE_ID);
	});

	it("advanceState updates the current node and history", () => {
		startGame(userId);
		const state = advanceState(userId, "check_logs");
		assert.equal(state.currentNodeId, "check_logs");
		assert.deepEqual(state.choiceHistory, [STARTING_NODE_ID, "check_logs"]);
	});

	it("advanceState creates a new game if none exists", () => {
		const state = advanceState(userId, "check_logs");
		assert.equal(state.currentNodeId, STARTING_NODE_ID);
	});

	it("setMessageRef updates channel and timestamp", () => {
		startGame(userId);
		setMessageRef(userId, "C_CHANNEL", "1234.5678");
		const state = getState(userId);
		assert.equal(state.channelId, "C_CHANNEL");
		assert.equal(state.messageTs, "1234.5678");
	});

	it("setMessageRef is a no-op for unknown users", () => {
		setMessageRef("U_UNKNOWN", "C_CHANNEL", "1234.5678");
		assert.equal(getState("U_UNKNOWN"), undefined);
	});

	it("resetGame clears the user state", () => {
		startGame(userId);
		resetGame(userId);
		assert.equal(getState(userId), undefined);
	});
});
