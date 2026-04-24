import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
	advanceState,
	getFormData,
	getState,
	resetGame,
	setFormData,
	setMessageRef,
	startGame,
} from "../../game/state.js";
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

	it("startGame initializes empty formData", () => {
		const state = startGame(userId);
		assert.deepEqual(state.formData, {});
	});

	it("setFormData stores a value", () => {
		startGame(userId);
		setFormData(userId, "postmortemTitle", "Null pointer in profile endpoint");
		const data = getFormData(userId);
		assert.equal(data.postmortemTitle, "Null pointer in profile endpoint");
	});

	it("setFormData is a no-op for unknown users", () => {
		setFormData("U_UNKNOWN", "key", "value");
		assert.deepEqual(getFormData("U_UNKNOWN"), {});
	});

	it("getFormData returns empty object for unknown users", () => {
		assert.deepEqual(getFormData("U_UNKNOWN"), {});
	});

	it("getFormData returns stored values", () => {
		startGame(userId);
		setFormData(userId, "a", "1");
		setFormData(userId, "b", "2");
		assert.deepEqual(getFormData(userId), { a: "1", b: "2" });
	});

	it("setFormData escapes mrkdwn characters", () => {
		startGame(userId);
		setFormData(userId, "title", "*bold* _italic_ ~strike~ `code` >quote");
		const data = getFormData(userId);
		assert.equal(
			data.title,
			"\u200B*\u200Bbold\u200B*\u200B \u200B_\u200Bitalic\u200B_\u200B \u200B~\u200Bstrike\u200B~\u200B \u200B`\u200Bcode\u200B`\u200B \u200B>\u200Bquote",
		);
	});

	it("setFormData trims leading and trailing whitespace", () => {
		startGame(userId);
		setFormData(userId, "title", "  hello world  ");
		assert.equal(getFormData(userId).title, "hello world");
	});
});
