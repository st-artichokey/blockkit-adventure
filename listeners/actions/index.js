import { adventureChoiceCallback } from "./adventure-choice.js";
import { openFormCallback } from "./open-form.js";
import { helpCallback, viewJourneyCallback } from "./open-modal.js";

/**
 * Register action listeners.
 * @param {import('@slack/bolt').App} app - The Bolt app instance
 */
export function register(app) {
	app.action(/^adventure_choice_/, adventureChoiceCallback);
	app.action("adventure_play_again", adventureChoiceCallback);
	app.action("adventure_open_form", openFormCallback);
	app.action("adventure_view_journey", viewJourneyCallback);
	app.action("adventure_help", helpCallback);
}
