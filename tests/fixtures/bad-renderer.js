/**
 * Dummy renderer with intentional Block Kit violations for testing /validate-blocks.
 * Each function has specific constraint violations noted in comments.
 */

// Violation: header text exceeds 150 char limit
export function buildLongHeaderBlocks() {
	return [
		{
			type: "header",
			text: {
				type: "plain_text",
				text: "This header text is way too long and exceeds the one hundred and fifty character limit that Slack enforces on header blocks so it should be flagged by the validator",
				emoji: true,
			},
		},
	];
}

// Violation: button text exceeds 75 char limit
export function buildBadButtonBlocks() {
	return [
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "This button label is far too long and should definitely be caught by the validator check",
						emoji: true,
					},
					action_id: "too_long_button",
				},
			],
		},
	];
}

// Violation: section uses plain_text instead of mrkdwn (valid but unusual),
// and text field is missing entirely on second section (required field missing)
export function buildBadSectionBlocks() {
	return [
		{
			type: "section",
			text: { type: "mrkdwn", text: "This section is fine." },
		},
		{
			type: "section",
			// Missing required text or fields
		},
	];
}

// Violation: more than 50 blocks in a message
export function buildTooManyBlocks() {
	const blocks = [];
	for (let i = 0; i < 55; i++) {
		blocks.push({
			type: "section",
			text: { type: "mrkdwn", text: `Block number ${i + 1}` },
		});
	}
	return blocks;
}

// Violation: context block has more than 10 elements
export function buildBadContextBlocks() {
	const elements = [];
	for (let i = 0; i < 12; i++) {
		elements.push({ type: "mrkdwn", text: `Element ${i + 1}` });
	}
	return [
		{
			type: "context",
			elements,
		},
	];
}
