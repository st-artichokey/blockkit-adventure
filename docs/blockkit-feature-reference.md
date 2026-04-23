# Block Kit Feature Reference

A checklist of Block Kit features and their implementation status in blockkit-adventure.

## Block Types

| Block | Status | Notes |
|-------|--------|-------|
| Header | :white_check_mark: Used | Scene titles |
| Section | :white_check_mark: Used | Narrative text, App Home content, accessory buttons |
| Divider | :white_check_mark: Used | Visual separators between content |
| Actions | :white_check_mark: Used | Choice buttons, Play Again |
| Context | :white_check_mark: Used | Step count, path history |
| Image | Not yet | Scene illustrations, mood imagery |
| Rich Text | Not yet | Complex formatted content |
| Video | Not yet | Embedded video content |
| File | Not yet | Shared file references |
| Input | Not yet | Form fields inside modals |

## Interactive Elements

| Element | Status | Notes |
|---------|--------|-------|
| Button | :white_check_mark: Used | Choices (primary/danger styles), Play Again, Start Adventure |
| Static Select | Not yet | Dropdown menus with predefined options |
| External Select | Not yet | Dropdown populated from external data source |
| Users Select | Not yet | User picker |
| Conversations Select | Not yet | Channel/DM picker |
| Channels Select | Not yet | Public channel picker |
| Multi-Select (all variants) | Not yet | Multiple selection versions of above |
| Overflow Menu | Not yet | Compact "..." menu for secondary actions |
| Date Picker | Not yet | Calendar date selection |
| Time Picker | Not yet | Time selection |
| Radio Buttons | Not yet | Single-select radio group |
| Checkboxes | Not yet | Multi-select checkboxes |
| Plain Text Input | Not yet | Single/multi-line text entry |
| URL Input | Not yet | URL-validated text entry |
| Email Input | Not yet | Email-validated text entry |
| Number Input | Not yet | Numeric text entry |

## View Types

| View | Status | Notes |
|------|--------|-------|
| App Home | :white_check_mark: Used | Game intro, start button, Block Kit links |
| Modal | :white_check_mark: Used | Journey Log, Help/How to Play |
| Workflow Step | Not yet | Workflow Builder integration |

## Composition Objects

| Object | Status | Notes |
|--------|--------|-------|
| plain_text | :white_check_mark: Used | Button labels, headers |
| mrkdwn | :white_check_mark: Used | Narrative content, info text |
| Confirm Dialog | Not yet | "Are you sure?" on dangerous actions |
| Option Object | Not yet | Items for select menus, radio buttons, checkboxes |
| Option Group | Not yet | Grouped options in select menus |
| Dispatch Action Config | Not yet | Control when actions fire from inputs |
| Filter Object | Not yet | Filter conversations/channels lists |

## Ideas for Future Implementation

Ranked by relevance to the adventure game:

1. **Image blocks** -- scene illustrations or mood-setting imagery
2. **Confirm dialogs** -- "Are you sure?" before risky choices
3. **Overflow menus** -- compact menus for secondary actions (save, restart, hints)
4. **Select menus** -- inventory item selection or multi-option scenarios
5. **Radio buttons** -- alternative choice presentation for longer option lists
6. **Input blocks + plain_text_input** -- puzzles requiring typed answers (riddles, passwords)
