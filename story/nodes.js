/**
 * Story graph for "The Lost Deploy" — a developer-themed choose-your-own-adventure.
 *
 * Each node has: id, title, text, choices (or isEnding + summary).
 * Choice action IDs follow the pattern: adventure_choice_<nextNodeId>
 */

export const STARTING_NODE_ID = "friday_alert";

/**
 * @typedef {Object} Choice
 * @param {string} text - Button label
 * @param {string} nextNodeId - ID of the next story node
 * @param {string} [style] - Button style: "primary" or "danger"
 * @param {string} [confirmText] - If set, shows a confirm dialog with this title before proceeding
 */

/**
 * @typedef {Object} FormInput
 * @param {string} label - Label shown above the text input in the modal
 * @param {string} placeholder - Placeholder text inside the input
 * @param {string} buttonText - Text for the button that opens the modal
 * @param {string} [buttonStyle] - Button style: "primary" or "danger"
 * @param {string} nextNodeId - Node to advance to after submission
 * @param {string} stateKey - Key under which to store the input in game state
 * @param {string} [modalHeader] - Header text shown at the top of the modal
 * @param {string} [modalFlavorText] - Flavor text shown below the header in the modal
 * @param {string} [modalHint] - Context hint shown below the input in the modal
 */

/**
 * @typedef {Object} StoryNode
 * @param {string} id - Unique node identifier
 * @param {string} title - Scene heading
 * @param {string} text - Narrative text (mrkdwn format)
 * @param {Choice[]} [choices] - Available player choices
 * @param {FormInput} [formInput] - If present, this node collects text input via a modal
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
			{
				text: "Rollback immediately",
				nextNodeId: "rollback_hasty",
				style: "danger",
				confirmText: "No time to check?",
			},
			{ text: "Close laptop and leave", nextNodeId: "ignore_alert" },
		],
	},

	check_logs: {
		id: "check_logs",
		title: "Into the Logs",
		text: "You SSH into the production box and tail the logs. Errors are flying by:\n\n```\nERROR: Cannot read property 'email' of undefined\nERROR: Cannot read property 'email' of undefined\nERROR: Cannot read property 'email' of undefined\n```\n\nIt looks like the new user profile endpoint is crashing. The deploy changed how user data is fetched. You spot two possible causes.",
		choices: [
			{
				text: "Hotfix the null check",
				nextNodeId: "hotfix_null",
				style: "danger",
				confirmText: "Ship it without tests?",
			},
			{ text: "Rollback with context", nextNodeId: "rollback_smart", style: "primary" },
			{ text: "Page the author", nextNodeId: "page_author" },
		],
	},

	rollback_hasty: {
		id: "rollback_hasty",
		title: "Hasty Rollback",
		text: "You fire off the rollback command without checking what changed. The deploy pipeline kicks off...\n\n:hourglass_flowing_sand: 3 minutes pass...\n\nThe rollback completes, but the error rate is *still climbing*. Turns out the previous version had a different bug that was masked by a feature flag — which was toggled off in the new deploy. Now you have *two* problems.",
		choices: [
			{ text: "Check the logs now", nextNodeId: "check_logs", style: "primary" },
			{
				text: "Roll forward to the broken version",
				nextNodeId: "roll_forward_chaos",
				style: "danger",
				confirmText: "Deploy on top of a broken deploy?",
			},
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
			{
				text: "Skip review and force-push to main",
				nextNodeId: "force_push",
				style: "danger",
				confirmText: "Bypass branch protection?",
			},
		],
	},

	rollback_smart: {
		id: "rollback_smart",
		title: "Strategic Rollback",
		text: "You check the diff, verify the previous version is stable, and initiate a rollback with a clear incident note in Slack.\n\n:white_check_mark: Error rate drops to zero within 2 minutes.\n\nYou write up a quick summary of the root cause and pin it in the channel. But now you have a choice about what to do next.",
		choices: [
			{ text: "Write a post-mortem tonight", nextNodeId: "postmortem_tonight", style: "primary" },
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
			{ text: "Write a post-mortem tonight", nextNodeId: "postmortem_tonight", style: "primary" },
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
		text: "You open a doc and start writing while it's fresh. Root cause, timeline, impact, action items.\n\nBefore you share it, you need a clear title that captures the incident for the team. Or you could skip it and head home...",
		formInput: {
			label: "Post-mortem title",
			placeholder: "e.g., :fire: Null pointer in user profile endpoint",
			buttonText: ":memo: Write Post-Mortem Title",
			buttonStyle: "primary",
			nextNodeId: "postmortem_complete",
			stateKey: "postmortemTitle",
			modalHeader: ":memo: Post-Mortem",
			modalFlavorText:
				"Your team is waiting in #incident-review. A good title helps everyone find this later.",
			modalHint: "Keep it concise — this goes in the incident tracker.",
		},
		choices: [{ text: "Skip it and go home", nextNodeId: "postmortem_skipped" }],
	},

	postmortem_complete: {
		id: "postmortem_complete",
		title: "Post-Mortem Published",
		text: 'You publish the post-mortem: *"{{postmortemTitle}}"*\n\nThe team reviews it Monday morning. Your thorough write-up becomes a template for future incidents. Leadership gives kudos in the all-hands.',
		isEnding: true,
		summary:
			'You diagnosed the problem, fixed it properly, and wrote a post-mortem titled "{{postmortemTitle}}". Senior engineer energy.',
		emoji: ":trophy:",
	},

	postmortem_skipped: {
		id: "postmortem_skipped",
		title: "No Post-Mortem",
		text: 'You close the doc and head home. "I\'ll write it Monday," you tell yourself.\n\n:calendar: Monday arrives. Nobody remembers the exact timeline. The action items are fuzzy. Three weeks later, the same bug ships again.',
		isEnding: true,
		summary:
			"You fixed the incident but skipped the follow-through. Without documentation, the team repeated the same mistake. The post-mortem writes itself — eventually.",
		emoji: ":wastebasket:",
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
		text: 'You hop on a call with Alex and walk them through reading the logs, identifying the bug, and writing the fix. It takes a bit longer, but Alex learns the debugging process.\n\nAlex pushes the PR. You review and approve. The fix deploys cleanly.\n\n"Thank you so much," Alex says. "I was terrified but now I actually understand what happened."\n\nYou could send Alex an encouraging message — or just say thanks and head out.',
		formInput: {
			label: "Message to Alex",
			placeholder: "e.g., :star: Great debugging today!",
			buttonText: ":speech_balloon: Send Alex a message",
			buttonStyle: "primary",
			nextNodeId: "mentor_fix_complete",
			stateKey: "alexMessage",
			modalHeader: ":speech_balloon: Message to Alex",
			modalFlavorText: "Alex is online and just pushed the fix. Now's a good time to send a note.",
			modalHint: "Alex is new to the team — a kind word goes a long way.",
		},
		choices: [{ text: "Just say thanks and go", nextNodeId: "mentor_fix_quick" }],
	},

	mentor_fix_complete: {
		id: "mentor_fix_complete",
		title: "The Encouraging DM",
		text: 'You open a DM to Alex and type:\n\n> {{alexMessage}}\n\nAlex replies almost instantly: ":smiling_face_with_tear: This means a lot. I was so nervous but you made it feel safe to learn."\n\nYou close your laptop with a smile. That message will stick with Alex longer than any code review.',
		isEnding: true,
		summary:
			'You turned a production incident into a mentoring moment and followed up with an encouraging message: "{{alexMessage}}". That\'s a multiplier.',
		emoji: ":raised_hands:",
	},

	mentor_fix_quick: {
		id: "mentor_fix_quick",
		title: "Quick Thanks",
		text: 'You give Alex a quick "great job" and head out. Alex seems relieved but still a little shaken.\n\n:moon: On Monday, Alex is quieter than usual. They fixed the bug, but the experience left them anxious about deploying. A follow-up message might have helped.',
		isEnding: true,
		summary:
			"You helped Alex fix the bug, but the quick exit left them uncertain. A little encouragement after a tough moment can make all the difference.",
		emoji: ":wave:",
	},
};
