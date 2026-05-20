# Introduction: Building a Slack App for the Marketplace

The Slack Marketplace is where teams discover and install apps that extend their workspace. Listing your app there puts it in front of millions of potential users — but getting from "working prototype" to "approved listing" requires deliberate preparation beyond just writing functional code.

This guide walks through the full journey using a real app — **Block Kit Adventure** — as a running example. It's a choose-your-own-adventure game built with Bolt for JavaScript that demonstrates Block Kit features through interactive gameplay. We'll reference its code, manifest, and architecture decisions throughout to ground each concept in working implementation.

## What This Guide Covers

Ten posts, each focused on a stage of the process:

1. **Introduction** (you're here)
2. **Planning your app** — choosing interaction surfaces and scoping permissions
3. **Building for distribution** — OAuth, token management, persistence, hosting
4. **Crafting your manifest** — display info, features, scopes, and the `app_directory` section
5. **Polishing the user experience** — App Home, error handling, confirmation flows
6. **Testing and quality** — unit tests, Block Kit validation, multi-workspace testing
7. **Security and privacy** — data practices, token revocation, secrets management
8. **Preparing your listing** — descriptions, screenshots, support resources
9. **The submission process** — checklists, review criteria, common rejections
10. **Post-launch** — monitoring, updates, and growing your user base

## The Example App: Block Kit Adventure

Block Kit Adventure is a Bolt v4 app (Node.js, ESM) that runs a developer-themed story called "The Lost Deploy." Players navigate a Friday afternoon production incident through button choices in a DM, encountering different Block Kit elements along the way.

Here's what makes it a useful reference:

- **Multiple interaction surfaces** — global shortcut, App Home tab, DM messages, modals
- **Rich Block Kit usage** — headers, sections, actions, context, dividers, images, inputs, button styles, confirm dialogs
- **In-place message updates** — the game updates a single message via `chat.update` rather than posting new ones
- **Form collection** — modals with `plain_text_input` that feed data back into the narrative
- **Clean architecture** — listeners organized by type, game logic separated from rendering

The current codebase runs in Socket Mode for a single workspace. Throughout this guide, we'll show both what it does well (manifest structure, UX patterns, testing) and what would need to change for marketplace distribution (OAuth, persistence, hosting).

## Prerequisites

Before starting marketplace preparation, you should have:

- **A working Slack app** — something that functions in at least one workspace
- **A Slack developer account** — access to [api.slack.com/apps](https://api.slack.com/apps)
- **Familiarity with Bolt** (or the Slack APIs directly) — this guide assumes you can read Bolt handler code
- **Your app's source under version control** — you'll be making structural changes

If you're starting from scratch, the [Bolt getting started guide](https://docs.slack.dev/bolt-js/getting-started) will get you to a working app. Come back here once you have something that works locally.

## The Gap Between "Works" and "Listed"

A common misconception: marketplace readiness is mostly about filling out forms. In practice, the technical and UX work outweighs the paperwork. Here's what typically needs to happen:

| Area | Single-workspace app | Marketplace-ready app |
|------|---------------------|----------------------|
| Auth | Hardcoded bot token | OAuth install flow with token storage |
| State | In-memory or local | Persistent, keyed by workspace + user |
| Hosting | Local / Socket Mode | Cloud-hosted HTTP endpoint (or documented self-host) |
| Errors | Console logs | User-facing feedback for every failure |
| Manifest | Minimal fields | Full `app_directory` section with live URLs |
| Testing | Manual | Automated, including multi-workspace scenarios |

Block Kit Adventure currently sits on the left side of this table. Over the next nine posts, we'll walk through moving each area to the right.

## How to Use This Guide

Read sequentially if you're preparing an app for the first time. If you're patching specific gaps, jump to the relevant section — each post is self-contained with cross-references where context from other sections is needed.

Code snippets come directly from the Block Kit Adventure repository. When you see a file path like `game/renderer.js`, that's a real file you can browse for full context.

---

*Next: [Planning Your App](02-planning.md)*
