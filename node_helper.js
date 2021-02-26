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
		const moduleId = payload.id;
		if (notification === "MMM-NextCloud-Tasks-UPDATE") {
			const client = self.initWebDav(payload.config);
			self.getData(moduleId, client, (payload) => {
				self.sendData(moduleId, payload);
			});
		}
	},

	initWebDav: function(config) {
		return client = createClient(config.listUrl, config.webDavAuth);
	},

	getData: async function(moduleId, client, callback) {
		let self = this;
		let todos = [];

		try {
			const directoryItems = await client.getDirectoryContents("/");

			for (const element of directoryItems) {
				const text = await client.getFileContents(element.filename, { format: "text" });
				const icsObj = ical.sync.parseICS(text);
				Object.values(icsObj).forEach(element => {
					if (element.type === 'VTODO') todos.push(element);
				});
			}
			callback(todos);
		} catch (error) {
			console.error("WebDav", error);
			if(error.status === 401) {
				self.sendError(moduleId, "WebDav: Unauthorized!");
			} else if(error.status === 404) {
				self.sendError(moduleId, "WebDav: URL Not Found!");
			} else {
				self.sendError(moduleId, "WebDav: Unknown error!");
				self.sendLog(moduleId, ["WebDav: Unknown error: ", error]);
			}
		}
	},

	sendData: function(moduleId, payload) {
		this.sendSocketNotification("MMM-NextCloud-Tasks-Helper-TODOS#" + moduleId, payload);
	},

	sendLog: function(moduleId, payload) {
		this.sendSocketNotification("MMM-NextCloud-Tasks-Helper-LOG#" + moduleId, payload);
	},

	sendError: function(moduleId, payload) {
		this.sendSocketNotification("MMM-NextCloud-Tasks-Helper-ERROR#" + moduleId, payload);
	}
});
