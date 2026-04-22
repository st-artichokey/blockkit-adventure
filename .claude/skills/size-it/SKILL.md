---
name: size-it
description: Classify coding task size and constrain effort accordingly — skip planning for small code changes, brief plan for medium, full plan mode for large. Reduces token waste by matching effort to code complexity.
user-invocable: true
---

# Size It — Task-Sized Code Execution

> **Version:** 1.0 | **Date:** 2026-04-22 | **Requires:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
>
> **Install:** Copy this `SKILL.md` file to `~/.claude/skills/size-it/SKILL.md` (personal, all projects) or `.claude/skills/size-it/SKILL.md` (single project). Invoke with `/size-it` before your coding request.

When this skill is invoked, follow these rules for the current user request and its response. Each new user message triggers a fresh classification — the skill does not persist across messages.

## Step 0: Verify This Is a Coding Task

This skill is designed for implementation tasks — writing, editing, or deleting code. If the request appears to be a question, research, discussion, or explanation rather than a code change, do not proceed with classification. Instead, respond:

> "This looks like [research/a question/discussion] rather than a code change. The size-it skill is designed for implementation tasks. Want me to proceed normally, or did you intend this as a coding task?"

If the user confirms it's a coding task, continue to Step 1. Otherwise, respond normally without the skill.

## Step 1: Classify the Task

Before doing any work, classify the user's request into one of three sizes based on scope and complexity. If the request is too ambiguous to classify from the prompt alone, do a brief investigation (Grep/Glob only, no full file reads) to determine scope, then classify.

If a request contains multiple tasks at different effort levels, classify and handle each separately. State all classifications upfront, then execute in order.

### Small (< 3 files, straightforward change)
Examples: fix a typo, rename a variable, update a string, add a simple function, toggle a flag

**Behavior:**
- Do NOT enter plan mode
- Only read files you will modify (reading before editing is expected — the constraint is to avoid reading *unrelated* files)
- Make the edit directly with minimal explanation
- Response should be under 3 sentences of text (code output excluded)
- No trailing summary of what you did

### Medium (3–8 files, moderate logic)
Examples: add validation to a form, wire up a new route, update a shared utility and its callers, write a test suite

**Behavior:**
- Write a brief plan as 3–5 bullet points, then implement immediately — unless the plan involves creating new files, in which case pause for a brief user confirmation before proceeding
- Only read files you will modify or that are direct dependencies
- Keep explanatory text to one short paragraph
- No trailing summary

### Large (8+ files, architectural, cross-cutting)
Examples: refactor a module, add a new feature end-to-end, redesign an API surface, migrate a dependency

**Behavior:**
- Use the `EnterPlanMode` tool to present your plan for user approval before writing any code
- Research the scope: read files you'll modify and their immediate dependencies. Use `Grep`/`Glob` to survey the broader codebase rather than reading every file
- Present the plan with file list, change description, and risks
- After approval, implement methodically

## Step 2: State the Classification

State it in one line before proceeding: `[effort: small|medium|large] — <one-line description>`. This lets the user correct if needed.

## Step 3: Execute

Follow the behavior rules for the classified size. Throughout execution, apply these universal constraints:

### Always
- Make the smallest complete change — don't add extras, but don't leave things half-done either. Update all occurrences, not just the first.
- Prefer editing existing files over creating new ones — unless the project's conventions call for separate files
- Complete all edits in a single response — don't split across messages unless blocked
- Do not re-read files already in context — make all edits to a file before moving on
- Do not use subagents — keep all work in the main context
- If the task is already done, say so in one line and stop

### Project conventions take precedence
- Project-level instructions (e.g., `CLAUDE.md` — the per-project instruction file that Claude Code reads automatically) always override effort constraints. If the project requires changelog updates, session logs, or other mandatory steps with commits, include them regardless of task size.

### Testing
- If the user's established workflow includes tests (e.g., TDD), follow it. For small tasks, ask before writing tests rather than assuming. For medium and large tasks, include test updates in the plan.

### Never
- Restate the request, summarize at the end, or explain changes line-by-line
- Add features, refactoring, docstrings, or annotations beyond what was asked
- Read files speculatively

## Override

If the user disagrees with the classification, respect their correction immediately. For example:
- "This is a small change" → switch to small behavior
- "Actually, plan this out" → switch to large behavior
- "Just do it" → switch to small behavior regardless of complexity
- "Be verbose" or "explain more" → lift the output constraints while keeping the effort level
- "No skill" or "normal mode" → disable the skill for this request entirely
