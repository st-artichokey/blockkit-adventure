import { formSubmitCallback } from "./form-submit.js";

/**
 * Register view submission listeners.
 * @param {import('@slack/bolt').App} app - The Bolt app instance
 */
export function register(app) {
	app.view("adventure_form_submit", formSubmitCallback);
}
