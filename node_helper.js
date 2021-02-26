/* Magic Mirror
 * Node Helper: MMM-NextCloud-Tasks
 *
 * By Jan Ryklikas
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const { AuthType, createClient } = require("webdav");
const ical = require("node-ical");

module.exports = NodeHelper.create({

	socketNotificationReceived: function(notification, payload) {
		let self = this;
		console.log("SoulOfHelper: received Notification", notification, payload);
		if (notification === "SoulOfTestModule-UPDATE_TODOS") {
			const config = payload;
			const client = self.initWebDav(config);
			
			self.getData(client, (payload) => {
				console.log("SoulOfHelper: sending Notification", payload);
				self.sendSocketNotification("SoulOfTestModule-UPDATE_TODOS", payload);
			});
		}
	},

	initWebDav: function(config) {
		return client = createClient(config.listUrl, config.webDavAuth);
	},

	getData: async function(client, callback) {
		let todos = [];
		const directoryItems = await client.getDirectoryContents("/");
		for (const element of directoryItems) {
			const text = await client.getFileContents(element.filename, { format: "text" });
			const icsObj = ical.sync.parseICS(text);
			Object.values(icsObj).forEach(element => {
				if (element.type === 'VTODO') todos.push(element);
			});
		}
		console.log(todos);
		callback(todos);
	},
});
