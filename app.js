import "dotenv/config";
import bolt from "@slack/bolt";
import { registerListeners } from "./listeners/index.js";

const { App } = bolt;

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	appToken: process.env.SLACK_APP_TOKEN,
	socketMode: true,
});

registerListeners(app);

(async () => {
	await app.start();
	console.log("⚡ Block Kit Adventure is running!");
})();
