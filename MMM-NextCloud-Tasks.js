/* global Module */

/* Magic Mirror
 * Module: MMM-NextCloud-Tasks
 *
 * By Jan Ryklikas
 * MIT Licensed.
 */

Module.register("MMM-NextCloud-Tasks", {
	defaults: {
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		var toDoList = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;

		Log.log("SoulOfModule: sending Notification", self.config);
		self.sendSocketNotification("SoulOfTestModule-UPDATE_TODOS", self.config);

	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		if (self.toDoList) {
			Log.info("ToDos: ", self.toDoList);
			var someWrapper = document.createElement("div");

			someWrapper.innerHTML = "<ul>";
			for (const element of self.toDoList) {
				someWrapper.innerHTML += "<li>" + element.summary + "</li>";
			}
			someWrapper.innerHTML += "</ul>";

			wrapper.appendChild(someWrapper);
		} else {
			Log.error('No todo list');
		}
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"SoulOfTestModule.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		Log.log("SoulOfModule: received Notification", notification, payload);
		if(notification === "SoulOfTestModule-UPDATE_TODOS") {
			this.toDoList = payload;
			this.updateDom();
		}
	},
});
