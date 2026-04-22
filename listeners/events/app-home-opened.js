/**
 * Handle the app_home_opened event — publish the App Home tab.
 * @param {Object} params - Bolt event handler arguments
 * @param {Object} params.event - The event payload
 * @param {Object} params.client - Slack WebClient
 * @param {Object} params.logger - Logger instance
 */
export async function appHomeOpenedCallback({ event, client, logger }) {
	try {
		await client.views.publish({
			user_id: event.user,
			view: {
				type: "home",
				blocks: [
					{
						type: "header",
						text: {
							type: "plain_text",
							text: ":book: The Lost Deploy",
							emoji: true,
						},
					},
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text: "A choose-your-own-adventure game built with *Block Kit*.\n\nIt's 4:59 PM on a Friday. A production deploy just failed. What do you do?",
						},
					},
					{ type: "divider" },
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text: "Start your adventure and see how you handle the incident. Every choice leads to a different outcome.",
						},
						accessory: {
							type: "button",
							text: {
								type: "plain_text",
								text: "Start Adventure",
								emoji: true,
							},
							action_id: "start_adventure_home",
							style: "primary",
						},
					},
					{ type: "divider" },
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text: ":books: *Learn more about Block Kit*\n• <https://docs.slack.dev/reference/block-kit|Block Kit documentation>\n• <https://app.slack.com/block-kit-builder|Block Kit Builder> — design and preview layouts",
						},
					},
					{ type: "divider" },
					{
						type: "context",
						elements: [
							{
								type: "mrkdwn",
								text: "You can also start a game with the */start_adventure* global shortcut.",
							},
						],
					},
				],
			},
		});
	} catch (error) {
		logger.error(`App Home error: ${error.message}`);
	}
}
