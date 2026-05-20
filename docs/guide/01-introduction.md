# Introduction: Building a Slack App for the Marketplace

The Slack Marketplace is where teams discover and install apps that extend their workspace. Listing your app there puts it in front of millions of potential users — but getting from "working prototype" to "approved listing" requires deliberate preparation beyond just writing functional code.

This guide walks through the full journey using a real app — **Block Kit Adventure** — as a running example. It's a choose-your-own-adventure game built with Bolt for JavaScript that demonstrates Block Kit features through interactive gameplay. We'll reference its code, manifest, and architecture decisions throughout to ground each concept in working implementation.

## What This Guide Covers

This guide is organized into ten posts, each focused on a stage of the marketplace journey. After this introduction, we start with planning — choosing interaction surfaces, designing for multi-workspace from day one, and scoping permissions to the minimum your app needs. From there, we move into the technical work of building for distribution: OAuth install flows, token management, persistent state, and hosting decisions.

The middle sections cover what makes or breaks a marketplace listing in practice. We walk through manifest configuration, UX polish (error handling, App Home onboarding, confirmation dialogs), testing strategies that go beyond unit tests, and the security and privacy requirements that trip up many first-time submissions.

The final posts focus on the marketplace itself — preparing your listing copy and screenshots, navigating the submission and review process, and maintaining your app after launch. Each post is self-contained but builds on concepts from earlier sections.

## The Example App: Block Kit Adventure

Block Kit Adventure is a Bolt v4 app (Node.js, ESM) that runs a developer-themed story called "The Lost Deploy." Players navigate a Friday afternoon production incident through button choices in a DM, encountering different Block Kit elements along the way.

The app touches multiple interaction surfaces — a global shortcut and App Home tab for entry points, DM messages for gameplay, and modals for collecting text input. It renders headers, sections, actions, context blocks, dividers, images, styled buttons, and confirm dialogs, making it a practical reference for most of the Block Kit surface area. The game updates a single message in place via `chat.update` rather than posting new messages per choice, and modal form submissions feed user-provided text back into the narrative through template resolution.

Architecturally, the codebase separates concerns cleanly: listeners organized by type (actions, events, shortcuts, views), game logic isolated from Block Kit rendering, and story data defined declaratively in a graph structure. The current codebase runs in Socket Mode for a single workspace. Throughout this guide, we'll show both what it does well (manifest structure, UX patterns, testing) and what would need to change for marketplace distribution (OAuth, persistence, hosting).

## Prerequisites

This guide assumes you already have a working Slack app — something that functions in at least one workspace, even if it's just your development workspace. You'll need a Slack developer account with access to [api.slack.com/apps](https://api.slack.com/apps), and your app's source should be under version control since we'll be making structural changes throughout.

The code examples use Bolt for JavaScript, so familiarity with Bolt (or the underlying Slack APIs) will help you follow along. If you're starting from scratch, the [Bolt getting started guide](https://docs.slack.dev/bolt-js/getting-started) will get you to a working app. Come back here once you have something running locally.

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
