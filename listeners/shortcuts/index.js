import { startAdventureCallback } from "./start-adventure.js";

/**
 * Register shortcut listeners.
 * @param {import('@slack/bolt').App} app - The Bolt app instance
 */
export function register(app) {
	app.shortcut("start_adventure", startAdventureCallback);
	app.action("start_adventure_home", startAdventureCallback);
}
