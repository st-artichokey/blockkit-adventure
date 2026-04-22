import { appHomeOpenedCallback } from "./app-home-opened.js";

/**
 * Register event listeners.
 * @param {import('@slack/bolt').App} app - The Bolt app instance
 */
export function register(app) {
	app.event("app_home_opened", appHomeOpenedCallback);
}
