/* global Module */

/* Magic Mirror
 * Module: MMM-NextCloud-Tasks
 *
 * By Jan Ryklikas
 * MIT Licensed.
 */

Module.register("MMM-NextCloud-Tasks", {
	defaults: {
		updateInterval: 60000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var toDoList = null;
		var error = null;

		//Flag for check if module is loaded
		this.loaded = false;

		if(this.verifyConfig(this.config)) {
			Log.info("config valid");
			// Schedule update timer.
			this.getData();
			setInterval(function() {
				self.getData();
				self.updateDom();
			}, this.config.updateInterval);
		} else {
			Log.info("config invalid");
			self.updateDom();
		}
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		this.sendSocketNotification(
			"MMM-NextCloud-Tasks-UPDATE",
			{
				id: this.identifier,
				config: this.config
			}
		);
	},

	getDom: function() {
		let self = this;

		// create element wrapper for show into the module
		let wrapper = document.createElement("div");

		if (self.error) {
			wrapper.innerHTML= "<div>" + self.error + "</div>";
		}

		if (self.toDoList) {
			Log.info("ToDos: ", self.toDoList);
			let someWrapper = document.createElement("div");

			someWrapper.innerHTML = "<ul>";
			for (const element of self.toDoList) {
				someWrapper.innerHTML += "<li>" + element.summary + "</li>";
			}
			someWrapper.innerHTML += "</ul>";

			wrapper.appendChild(someWrapper);
		} else {
			wrapper.innerHTML= "<div>Loading...</div>";
		}
		this.error = null;
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-NextCloud-Tasks.css",
		];
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-NextCloud-Tasks-Helper-TODOS#" + this.identifier) {
			Log.log("received ToDos", payload);
			this.toDoList = payload;
			this.updateDom();
		}
		if(notification === "MMM-NextCloud-Tasks-Helper-LOG#" + this.identifier) {
			Log.log("LOG: ", payload);
		}
		if(notification === "MMM-NextCloud-Tasks-Helper-ERROR#" + this.identifier) {
			Log.error("ERROR: ", payload);
			this.error += payload + "<br>";
			this.updateDom();
		}
	},

	verifyConfig: function(config) {
		if(
			typeof config.listUrl === "undefined" ||
			typeof config.webDavAuth === "undefined" ||
			typeof config.webDavAuth.username === "undefined" ||
			typeof config.webDavAuth.password === "undefined"
		) {
			this.error += "Config variable missing" + "<br>";
			Log.error("Config variable missing");
			return false;
		}
		return true;
	}
});
