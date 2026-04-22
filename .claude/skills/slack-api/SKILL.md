---
name: slack-api
description: Quick reference lookup for Slack API methods and Block Kit elements from official docs
argument-hint: "<method or element>"
allowed-tools: WebFetch WebSearch
---

# Slack API — Quick Reference Lookup

Fetch concise reference information for a Slack API method or Block Kit element from official Slack documentation.

## Input

`$ARGUMENTS` is the API method or Block Kit element to look up. Examples:
- `chat.update`
- `views.publish`
- `section block`
- `button element`
- `modal`
- `app_home_opened event`

## Steps

1. **Determine the doc URL** based on the query:
   - API methods (`chat.update`, `views.open`, etc.) → `https://docs.slack.dev/reference/methods/<method>`
   - Block Kit blocks (`section`, `header`, etc.) → `https://docs.slack.dev/reference/block-kit/blocks/<name>-block`
   - Block Kit elements (`button`, `select`, etc.) → `https://docs.slack.dev/reference/block-kit/block-elements/<name>-element`
   - Events (`app_home_opened`, etc.) → `https://docs.slack.dev/reference/events/<event_name>`
   - Surfaces (`modal`, `home tab`, etc.) → `https://docs.slack.dev/reference/surfaces/<name>`

2. **Fetch the page** using WebFetch.

3. **Extract and present** a concise summary:
   - **Method/element name** and one-line description
   - **Required fields/parameters** with types
   - **Key constraints** (max lengths, limits, required scopes)
   - **Minimal code example** (JSON payload or JS snippet)
   - **Common gotchas** if any are documented

4. **Keep it short.** The goal is a quick reference card, not the full doc page. If the user needs more detail, provide the URL to the full docs.

## Output format

```
## <method/element name>
<one-line description>

**Required:** field1 (type), field2 (type)
**Optional:** field3 (type, default), field4 (type)
**Constraints:** max N items, text max M chars, requires scope:x

### Example
<minimal JSON or JS snippet>

**Gotchas:** <any common mistakes>

Full docs: <URL>
```

## Fallback

If the initial URL doesn't resolve or redirects unexpectedly, use WebSearch to find the correct docs.slack.dev page for the query.
