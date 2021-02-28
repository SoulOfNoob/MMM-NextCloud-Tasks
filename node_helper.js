/* Magic Mirror
 * Node Helper: MMM-NextCloud-Tasks
 *
 * By Jan Ryklikas
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const { AuthType, createClient } = require("webdav");
const ical = require("node-ical");
const transformer = require("./transformer");
const { fetchList, parseList } = require("./webDavHelper");

module.exports = NodeHelper.create({
	socketNotificationReceived: function(notification, payload) {
		let self = this;
		const moduleId = payload.id;
		if (notification === "MMM-NextCloud-Tasks-UPDATE") {
			
			self.getData(moduleId, payload.config, (payload) => {
				self.sendData(moduleId, payload);
			});
		}
	},

	initWebDav: function(config) {
		return client = createClient(config.listUrl, config.webDavAuth);
	},

	getData: async function(moduleId, config, callback) {
		let self = this;
		let todos = [];

		try {
			const icsList = await fetchList(config);
			todos = parseList(icsList);
			todos = transformer.transformData(todos);
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
