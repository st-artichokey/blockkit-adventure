import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STARTING_NODE_ID, STORY_NODES } from "../../story/nodes.js";

describe("Story graph integrity", () => {
	it("has a valid starting node", () => {
		assert.ok(STORY_NODES[STARTING_NODE_ID], "Starting node must exist");
	});

	it("all choice nextNodeIds reference existing nodes", () => {
		for (const [nodeId, node] of Object.entries(STORY_NODES)) {
			if (node.choices) {
				for (const choice of node.choices) {
					assert.ok(
						STORY_NODES[choice.nextNodeId],
						`Node "${nodeId}" choice "${choice.text}" references missing node "${choice.nextNodeId}"`,
					);
				}
			}
		}
	});

	it("all ending nodes have isEnding and summary", () => {
		for (const [nodeId, node] of Object.entries(STORY_NODES)) {
			if (node.isEnding) {
				assert.ok(node.summary, `Ending node "${nodeId}" must have a summary`);
			}
		}
	});

	it("non-ending nodes have choices", () => {
		for (const [nodeId, node] of Object.entries(STORY_NODES)) {
			if (!node.isEnding) {
				assert.ok(
					node.choices && node.choices.length > 0,
					`Non-ending node "${nodeId}" must have at least one choice`,
				);
			}
		}
	});

	it("has no orphan nodes (all non-start nodes are reachable)", () => {
		const referencedIds = new Set([STARTING_NODE_ID]);
		for (const node of Object.values(STORY_NODES)) {
			if (node.choices) {
				for (const choice of node.choices) {
					referencedIds.add(choice.nextNodeId);
				}
			}
		}

		for (const nodeId of Object.keys(STORY_NODES)) {
			assert.ok(
				referencedIds.has(nodeId),
				`Node "${nodeId}" is orphaned — not reachable from any choice`,
			);
		}
	});

	it("has at least one ending reachable", () => {
		const endings = Object.values(STORY_NODES).filter((n) => n.isEnding);
		assert.ok(endings.length > 0, "Story must have at least one ending");
	});

	it("confirmText only appears on danger-styled choices", () => {
		for (const [nodeId, node] of Object.entries(STORY_NODES)) {
			if (node.choices) {
				for (const choice of node.choices) {
					if (choice.confirmText) {
						assert.equal(
							choice.style,
							"danger",
							`Node "${nodeId}" choice "${choice.text}" has confirmText but style is "${choice.style}" (expected "danger")`,
						);
					}
				}
			}
		}
	});

	it("every node has required fields", () => {
		for (const [nodeId, node] of Object.entries(STORY_NODES)) {
			assert.equal(node.id, nodeId, `Node "${nodeId}" id field must match its key`);
			assert.ok(node.title, `Node "${nodeId}" must have a title`);
			assert.ok(node.text, `Node "${nodeId}" must have text`);
		}
	});
});
