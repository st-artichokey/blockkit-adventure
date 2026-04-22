---
name: validate-blocks
description: Validate Block Kit output against Slack's constraints — check block counts, text lengths, required fields, and element limits
argument-hint: "[file-path]"
allowed-tools: Read Grep Bash WebFetch
---

# Validate Blocks — Block Kit Constraint Checker

Validate that Block Kit blocks produced by this app conform to Slack's specification.

## Input

`$ARGUMENTS` is an optional file path to validate. Defaults to `game/renderer.js` if omitted.

## Constraints to check

| Block type | Required fields | Limits |
|---|---|---|
| `header` | `text` (plain_text only) | 150 chars |
| `section` | `text` or `fields` | text: 3,000 chars; fields: max 10, 2,000 chars each |
| `context` | `elements` | max 10 elements, 2,000 chars each |
| `actions` | `elements` | max 25 elements |
| `image` | `image_url`, `alt_text` | alt_text: 2,000 chars |
| `input` | `element`, `label` | label: 2,000 chars |
| **button** | `text` (plain_text) | text: 75 chars; value: 2,000 chars; action_id: 255 chars |

Messages: max 50 blocks. Modals/Home tabs: max 100.

## Steps

1. **Read** the target file and trace each function that returns blocks.

2. **Check** block counts, required fields, and text lengths. For dynamic content (e.g., `node.text`), check the actual data in `story/nodes.js`.

3. **Report** each function as pass/fail with the specific constraint and location. If all pass: "All Block Kit constraints satisfied."

4. **Suggest fixes** for any violations with code references.
