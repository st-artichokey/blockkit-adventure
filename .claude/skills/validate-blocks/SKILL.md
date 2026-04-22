---
name: validate-blocks
description: Validate Block Kit output against Slack's constraints — check block counts, text lengths, required fields, and element limits
argument-hint: "[file-path]"
allowed-tools: Read Grep Bash WebFetch
---

# Validate Blocks — Block Kit Constraint Checker

Validate that the Block Kit blocks produced by this app conform to Slack's Block Kit specification.

## Input

`$ARGUMENTS` is an optional file path to validate. Defaults to `game/renderer.js` if omitted.

## Block Kit Constraints

Check the target file's block-building functions against these rules:

### Block limits
- **Messages:** max 50 blocks
- **Modals / Home tabs:** max 100 blocks

### Block type requirements

| Block type | Required fields | Text max length |
|---|---|---|
| `header` | `text` (plain_text only) | 150 characters |
| `section` | `text` or `fields` (at least one) | text: 3,000 chars; each field: 2,000 chars |
| `section.fields` | — | max 10 items |
| `context` | `elements` | each element: 2,000 chars; max 10 elements |
| `actions` | `elements` | max 25 elements |
| `divider` | (none) | — |
| `image` | `image_url`, `alt_text` | alt_text: 2,000 chars |
| `input` | `element`, `label` | label: 2,000 chars |

### Button element
- `text`: max 75 characters (plain_text only)
- `value`: max 2,000 characters
- `action_id`: max 255 characters
- `style`: must be `"primary"` or `"danger"` (or omitted)

## Steps

1. **Read** the target file.

2. **Trace** each function that returns blocks. Identify:
   - How many blocks are returned (static count or dynamic max)
   - Text content that could exceed length limits
   - Whether required fields are present on each block type
   - Button elements and their text/value/action_id lengths

3. **Check dynamically-generated content:**
   - If text is built from variables (e.g., `node.text`), check `story/nodes.js` for the actual content lengths
   - If blocks are generated in a loop, check whether the count could exceed limits

4. **Report findings** in this format:
   - List each function checked
   - For each: pass/fail with specific constraint and location
   - If all pass, confirm: "All Block Kit constraints satisfied."

5. **If any issues found**, suggest specific fixes with code references.

## When to use

- After modifying `game/renderer.js` or adding new Block Kit output
- After adding story nodes with long text content
- Before deploying to verify spec compliance
