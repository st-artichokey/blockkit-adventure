import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFormInputModal, buildHelpModal, buildJourneyLogModal } from "../../game/modals.js";

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

describe("buildFormInputModal", () => {
	const formInput = {
		label: "Post-mortem title",
		placeholder: "e.g., Null pointer in profile endpoint",
		buttonText: ":memo: Write Title",
		buttonStyle: "primary",
		nextNodeId: "postmortem_complete",
		stateKey: "postmortemTitle",
	};
	const nodeId = "postmortem_tonight";

	it("returns a modal view object", () => {
		const view = buildFormInputModal(formInput, nodeId);
		assert.equal(view.type, "modal");
	});

	it("has callback_id adventure_form_submit", () => {
		const view = buildFormInputModal(formInput, nodeId);
		assert.equal(view.callback_id, "adventure_form_submit");
	});

	it("has a submit button", () => {
		const view = buildFormInputModal(formInput, nodeId);
		assert.equal(view.submit.type, "plain_text");
		assert.ok(view.submit.text.length > 0);
	});

	it("has private_metadata containing nodeId and stateKey", () => {
		const view = buildFormInputModal(formInput, nodeId);
		const meta = JSON.parse(view.private_metadata);
		assert.equal(meta.nodeId, "postmortem_tonight");
		assert.equal(meta.stateKey, "postmortemTitle");
		assert.equal(meta.nextNodeId, "postmortem_complete");
	});

	it("contains an input block with plain_text_input", () => {
		const view = buildFormInputModal(formInput, nodeId);
		const inputBlock = view.blocks.find((b) => b.type === "input");
		assert.ok(inputBlock, "must have an input block");
		assert.equal(inputBlock.element.type, "plain_text_input");
	});

	it("input block uses the provided label and placeholder", () => {
		const view = buildFormInputModal(formInput, nodeId);
		const inputBlock = view.blocks.find((b) => b.type === "input");
		assert.equal(inputBlock.label.text, "Post-mortem title");
		assert.equal(inputBlock.element.placeholder.text, "e.g., Null pointer in profile endpoint");
	});

	it("input has max_length of 100", () => {
		const view = buildFormInputModal(formInput, nodeId);
		const inputBlock = view.blocks.find((b) => b.type === "input");
		assert.equal(inputBlock.element.max_length, 100);
	});

	it("includes header block when modalHeader is provided", () => {
		const enriched = { ...formInput, modalHeader: ":memo: Post-Mortem" };
		const view = buildFormInputModal(enriched, nodeId);
		const header = view.blocks.find((b) => b.type === "header");
		assert.ok(header, "must have a header block");
		assert.equal(header.text.text, ":memo: Post-Mortem");
	});

	it("includes flavor section when modalFlavorText is provided", () => {
		const enriched = {
			...formInput,
			modalHeader: ":memo: Post-Mortem",
			modalFlavorText: "Your team is waiting.",
		};
		const view = buildFormInputModal(enriched, nodeId);
		const sections = view.blocks.filter((b) => b.type === "section");
		assert.ok(sections.length > 0, "must have a flavor section");
		assert.ok(sections[0].text.text.includes("Your team is waiting."));
	});

	it("includes context hint when modalHint is provided", () => {
		const enriched = { ...formInput, modalHint: "Keep it concise." };
		const view = buildFormInputModal(enriched, nodeId);
		const context = view.blocks.find((b) => b.type === "context");
		assert.ok(context, "must have a context block");
		assert.ok(context.elements[0].text.includes("Keep it concise."));
	});

	it("omits header and context when modalHeader and modalHint are absent", () => {
		const view = buildFormInputModal(formInput, nodeId);
		const header = view.blocks.find((b) => b.type === "header");
		const context = view.blocks.find((b) => b.type === "context");
		assert.equal(header, undefined);
		assert.equal(context, undefined);
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
