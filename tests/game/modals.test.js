import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildHelpModal, buildJourneyLogModal } from "../../game/modals.js";

describe("buildJourneyLogModal", () => {
	const choiceHistory = ["friday_alert", "check_logs", "hotfix_null"];

	it("returns a modal view object", () => {
		const view = buildJourneyLogModal(choiceHistory);
		assert.equal(view.type, "modal");
	});

	it("has a title", () => {
		const view = buildJourneyLogModal(choiceHistory);
		assert.equal(view.title.type, "plain_text");
		assert.ok(view.title.text.length > 0);
	});

	it("has a close button", () => {
		const view = buildJourneyLogModal(choiceHistory);
		assert.equal(view.close.type, "plain_text");
		assert.ok(view.close.text.length > 0);
	});

	it("does not have a submit button", () => {
		const view = buildJourneyLogModal(choiceHistory);
		assert.equal(view.submit, undefined);
	});

	it("includes a section for each step in the history", () => {
		const view = buildJourneyLogModal(choiceHistory);
		const sections = view.blocks.filter(
			(b) => b.type === "section" && b.text.text.includes("Step"),
		);
		assert.equal(sections.length, choiceHistory.length);
	});

	it("shows node titles in the step sections", () => {
		const view = buildJourneyLogModal(choiceHistory);
		const text = view.blocks.map((b) => b.text?.text ?? "").join("\n");
		assert.ok(text.includes("The Friday Alert"));
		assert.ok(text.includes("Into the Logs"));
		assert.ok(text.includes("The Hotfix"));
	});

	it("includes a context block with the total step count", () => {
		const view = buildJourneyLogModal(choiceHistory);
		const context = view.blocks.filter((b) => b.type === "context");
		assert.ok(context.length > 0);
		const contextText = context[0].elements[0].text;
		assert.ok(contextText.includes("3"));
	});

	it("handles a single-step history", () => {
		const view = buildJourneyLogModal(["friday_alert"]);
		assert.equal(view.type, "modal");
		const sections = view.blocks.filter(
			(b) => b.type === "section" && b.text.text.includes("Step"),
		);
		assert.equal(sections.length, 1);
	});
});

describe("buildHelpModal", () => {
	it("returns a modal view object", () => {
		const view = buildHelpModal();
		assert.equal(view.type, "modal");
	});

	it("has a title", () => {
		const view = buildHelpModal();
		assert.equal(view.title.type, "plain_text");
		assert.ok(view.title.text.length > 0);
	});

	it("has a close button", () => {
		const view = buildHelpModal();
		assert.equal(view.close.type, "plain_text");
	});

	it("does not have a submit button", () => {
		const view = buildHelpModal();
		assert.equal(view.submit, undefined);
	});

	it("contains multiple blocks", () => {
		const view = buildHelpModal();
		assert.ok(view.blocks.length >= 3);
	});

	it("mentions choices and endings", () => {
		const view = buildHelpModal();
		const allText = view.blocks
			.map((b) => b.text?.text ?? b.elements?.map((e) => e.text).join("") ?? "")
			.join("\n")
			.toLowerCase();
		assert.ok(allText.includes("choice"));
		assert.ok(allText.includes("ending"));
	});
});
