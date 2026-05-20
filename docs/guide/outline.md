# Guide: Creating an App for the Slack Marketplace

## 1. Introduction
- What the Slack Marketplace is and why to list there
- What this guide covers (end-to-end from idea to submission)
- Prerequisites (Slack developer account, existing app or new idea)

## 2. Planning Your App
- Identifying a clear use case and target audience
- Choosing interaction surfaces (App Home, messages, modals, shortcuts)
- Designing for multi-workspace from the start
- Scoping permissions — request only what you need

## 3. Building with Distribution in Mind
- **OAuth install flow** — implementing multi-workspace installation (vs. single-workspace Socket Mode)
- **Token management** — storing and retrieving per-workspace tokens
- **State and persistence** — why in-memory won't work; choosing a data store
- **Hosting considerations** — HTTP endpoints vs. Socket Mode tradeoffs

## 4. Crafting Your Manifest
- App identity: name, descriptions (short and long), color
- Features: bot user, App Home, shortcuts, slash commands
- Scopes: principle of least privilege, justifying each scope
- The `app_directory` section:
  - Privacy policy URL
  - Support URL and email
  - Installation landing page
  - Pricing model
  - Supported languages

## 5. Polishing the User Experience
- First impressions: App Home as onboarding
- Error handling and user-facing feedback
- Confirmation dialogs for destructive actions
- Responsive interactions (acknowledge fast, update later)
- Empty states and edge cases

## 6. Testing and Quality
- Unit and integration testing your listeners
- Validating Block Kit output (block limits, text lengths, required fields)
- Testing the install flow across multiple workspaces
- Testing token revocation and reinstallation

## 7. Security and Privacy
- Writing a privacy policy (what data you collect, store, share)
- Data retention and deletion practices
- Handling token revocation (`tokens_revoked`, `app_uninstalled` events)
- HTTPS everywhere, secrets management

## 8. Preparing Your Listing
- Writing a compelling short description (under 140 chars)
- Writing the long description (features, how it works, getting started)
- Screenshots and visuals — what to capture
- Support resources: documentation, FAQ, contact info
- Pricing strategy (free, freemium, paid)

## 9. Submission Process
- Pre-submission checklist (scopes justified, URLs live, install flow works)
- What the review team looks for
- Common rejection reasons and how to avoid them
- Timeline expectations

## 10. Post-Launch
- Monitoring installs and usage
- Responding to user reviews and support requests
- Updating your app (versioning, changelog, re-review triggers)
- Growing your user base
