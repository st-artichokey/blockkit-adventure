/**
 * Story graph for "The Lost Deploy" — a developer-themed choose-your-own-adventure.
 *
 * Each node has: id, title, text, optional imageAlt, choices (or isEnding + summary).
 * Choice action IDs follow the pattern: adventure_choice_<nextNodeId>
 */

export const STARTING_NODE_ID = "friday_alert";

/**
 * @typedef {Object} Choice
 * @param {string} text - Button label
 * @param {string} nextNodeId - ID of the next story node
 * @param {string} [style] - Button style: "primary" or "danger"
 */

/**
 * @typedef {Object} StoryNode
 * @param {string} id - Unique node identifier
 * @param {string} title - Scene heading
 * @param {string} text - Narrative text (mrkdwn format)
 * @param {Choice[]} [choices] - Available player choices
 * @param {boolean} [isEnding] - Whether this is a terminal node
 * @param {string} [summary] - Ending summary text
 * @param {string} [emoji] - Emoji for the ending
 */

/** @type {Record<string, StoryNode>} */
export const STORY_NODES = {
	friday_alert: {
		id: "friday_alert",
		title: "The Friday Alert",
		text: "It's *4:59 PM on a Friday*. You're about to close your laptop when your phone buzzes.\n\n> :rotating_light: *ALERT: Production deploy failed. Error rate spiking 5x.*\n\nYour heart sinks. The deploy went out 10 minutes ago and nobody noticed until now. The on-call engineer is on a flight. What do you do?",
		choices: [
			{ text: "Check the logs", nextNodeId: "check_logs", style: "primary" },
			{ text: "Rollback immediately", nextNodeId: "rollback_blind" },
			{ text: "Close laptop and leave", nextNodeId: "ignore_alert", style: "danger" },
		],
	},

	check_logs: {
		id: "check_logs",
		title: "Into the Logs",
		text: "You SSH into the production box and tail the logs. Errors are flying by:\n\n```\nERROR: Cannot read property 'email' of undefined\nERROR: Cannot read property 'email' of undefined\nERROR: Cannot read property 'email' of undefined\n```\n\nIt looks like the new user profile endpoint is crashing. The deploy changed how user data is fetched. You spot two possible causes.",
		choices: [
			{ text: "Hotfix the null check", nextNodeId: "hotfix_null", style: "primary" },
			{ text: "Rollback with context", nextNodeId: "rollback_smart" },
			{ text: "Page the author", nextNodeId: "page_author" },
		],
	},

	rollback_blind: {
		id: "rollback_blind",
		title: "Blind Rollback",
		text: "You fire off the rollback command without checking what changed. The deploy pipeline kicks off...\n\n:hourglass_flowing_sand: 3 minutes pass...\n\nThe rollback completes, but the error rate is *still climbing*. Turns out the previous version had a different bug that was masked by a feature flag — which was toggled off in the new deploy. Now you have *two* problems.",
		choices: [
			{ text: "Check the logs now", nextNodeId: "check_logs" },
			{ text: "Roll forward to the broken version", nextNodeId: "roll_forward_chaos" },
		],
	},

	ignore_alert: {
		id: "ignore_alert",
		title: "Not My Problem",
		text: "You close the laptop and head out. \"Someone else will handle it,\" you think.\n\n:beer: An hour later, you're at happy hour when your phone starts *vibrating non-stop*. 47 missed Slack messages. Your manager. Your manager's manager. The CTO.\n\nThe outage lasted 90 minutes. Customer data was affected. Monday is going to be rough.",
		isEnding: true,
		summary:
			"You chose blissful ignorance. The outage spiraled, customers were affected, and your Monday inbox is a horror movie. Sometimes the deploy finds you.",
		emoji: ":see_no_evil:",
	},

	hotfix_null: {
		id: "hotfix_null",
		title: "The Hotfix",
		text: "You write a quick null check, push it to a branch, and open a PR. But you need someone to approve it — company policy, no exceptions.\n\nThe Slack channel is quiet. It's Friday evening. You can see three people online in the team channel.",
		choices: [
			{ text: "Ask for emergency review", nextNodeId: "emergency_review", style: "primary" },
			{ text: "Skip review and force-push to main", nextNodeId: "force_push", style: "danger" },
		],
	},

	rollback_smart: {
		id: "rollback_smart",
		title: "Strategic Rollback",
		text: "You check the diff, verify the previous version is stable, and initiate a rollback with a clear incident note in Slack.\n\n:white_check_mark: Error rate drops to zero within 2 minutes.\n\nYou write up a quick summary of the root cause and pin it in the channel. But now you have a choice about what to do next.",
		choices: [
			{ text: "Write a post-mortem tonight", nextNodeId: "postmortem_tonight" },
			{ text: "Set up monitoring and go home", nextNodeId: "monitor_and_go" },
		],
	},

	page_author: {
		id: "page_author",
		title: "Paging the Author",
		text: "You look up who authored the deploy. It's Alex, the new junior developer. You send a page...\n\n:phone: Alex picks up, panicked. \"Oh no, I thought I tested that! I'm so sorry!\"\n\nAlex is clearly stressed. They offer to help fix it remotely from their phone.",
		choices: [
			{ text: "Walk them through the fix", nextNodeId: "mentor_fix", style: "primary" },
			{ text: "Tell them you'll handle it", nextNodeId: "rollback_smart" },
		],
	},

	roll_forward_chaos: {
		id: "roll_forward_chaos",
		title: "Double Trouble",
		text: "You deploy the broken version back on top of the other broken version. The feature flag is now *on* and the null pointer is back.\n\nSomehow, the two bugs cancel each other out for about 30 seconds before the error rate *triples*.\n\n:fire: :fire: :fire:\n\nThe VP of Engineering joins the incident channel.",
		isEnding: true,
		summary:
			"Two wrongs didn't make a right. The cascading failures turned a 10-minute fix into a 3-hour outage. But hey, you learned a lot about feature flags.",
		emoji: ":fire_engine:",
	},

	emergency_review: {
		id: "emergency_review",
		title: "Emergency Review",
		text: 'You ping the channel: "Need emergency review — prod is down, one-line null check fix."\n\n:eyes: Sarah responds in 45 seconds. "LGTM, merging now."\n\nThe fix deploys. Error rate drops. You update the incident channel with the resolution.',
		choices: [
			{ text: "Write a post-mortem tonight", nextNodeId: "postmortem_tonight" },
			{ text: "Set up monitoring and go home", nextNodeId: "monitor_and_go" },
		],
	},

	force_push: {
		id: "force_push",
		title: "YOLO Push",
		text: "You bypass the branch protection, force-push to main, and trigger a deploy.\n\n:white_check_mark: The fix works! Error rate drops to zero.\n\nBut Monday morning, the security audit catches the force-push. Your access is flagged. The fix was right, but the process violation triggers a review.",
		isEnding: true,
		summary:
			"The hero deploy worked, but the cowboy process didn't. You fixed production and earned yourself a chat with security. Ship the fix and the process, next time.",
		emoji: ":cowboy_hat_face:",
	},

	postmortem_tonight: {
		id: "postmortem_tonight",
		title: "The Friday Night Post-Mortem",
		text: "You open a doc and start writing while it's fresh. Root cause, timeline, impact, action items. You identify a missing integration test that would have caught this.\n\nYou share it in the channel and get immediate kudos from leadership. The team feels informed and confident.",
		isEnding: true,
		summary:
			"You diagnosed the problem, fixed it properly, and left the team better prepared. The post-mortem became a template for future incidents. Senior engineer energy.",
		emoji: ":trophy:",
	},

	monitor_and_go: {
		id: "monitor_and_go",
		title: "Set It and Forget It",
		text: "You set up a quick alert on the error rate dashboard, post a summary in the incident channel, and head out.\n\n:moon: The night is quiet. No more alerts. Monday morning, you write a brief post-mortem and add a test to prevent regression.\n\nSolid incident response — you stopped the bleeding, communicated clearly, and followed up.",
		isEnding: true,
		summary:
			"You handled the incident like a pro: quick diagnosis, clean fix, clear communication, and proper follow-up. Work-life balance preserved. Well played.",
		emoji: ":star2:",
	},

	mentor_fix: {
		id: "mentor_fix",
		title: "Pair Programming Under Pressure",
		text: 'You hop on a call with Alex and walk them through reading the logs, identifying the bug, and writing the fix. It takes a bit longer, but Alex learns the debugging process.\n\nAlex pushes the PR. You review and approve. The fix deploys cleanly.\n\n"Thank you so much," Alex says. "I was terrified but now I actually understand what happened."',
		isEnding: true,
		summary:
			"You turned a production incident into a mentoring moment. The fix took a bit longer, but Alex will handle the next one on their own. That's a multiplier.",
		emoji: ":raised_hands:",
	},
};
