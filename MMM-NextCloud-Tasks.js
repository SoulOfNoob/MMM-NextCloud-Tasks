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
		hideCompletedTasks: true,
		sortMethod: "priority",
		colorize: false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	toDoList: null,
	error: null,

	start: function () {
		var self = this;

		//Flag for check if module is loaded
		self.loaded = false;

		if(self.verifyConfig(self.config)) {
			// Schedule update timer.
			self.getData();
			setInterval(function() {
				self.getData();
				self.updateDom();
			}, self.config.updateInterval);
		} else {
			Log.info("config invalid");
			self.error = "config invalid";
			self.updateDom();
		}
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function () {
		this.sendSocketNotification(
			"MMM-NextCloud-Tasks-UPDATE",
			{
				id: this.identifier,
				config: this.config
			}
		);
	},

	getDom: function () {
		let self = this;

		// create element wrapper for show into the module
		let wrapper = document.createElement("div");
		wrapper.className = "MMM-NextCloud-Tasks-wrapper";

		if (self.toDoList) {
			wrapper.appendChild(self.renderList(self.toDoList));
			self.error = null;
		} else {
			wrapper.innerHTML= "<div>Loading...</div>";
		}

		if (self.error) {
			wrapper.innerHTML= "<div>" + self.error + "</div>";
		}
		return wrapper;
	},

	renderList: function (children) {
		let self = this;

		let red = "<span style=\"color:#e3516e\">"
		let yellow = "<span style=\"color:#e1e34f\">"
		let blue = "<span style=\"color:#2f26f4\">"
		let grey = "<span style=\"color:#646464\">"
		let endSpan = "</span>"
		let checked = "<span class=\"fa fa-fw fa-check-square\"></span>"
		let unchecked = "<span class=\"fa fa-fw fa-square\"></span>"

		let ul = document.createElement("ul");
		for (const element of children) {
			self.config
			let p = element.priority;
			if (element.status !== "COMPLETED" || self.config.hideCompletedTasks === false) {
				icon = (element.status === "COMPLETED" ? checked : unchecked );
				let li = document.createElement("li");
				let color = (p < 5 ? red : (p == 5 ? yellow : (p <= 9 ? blue : grey)))
				
				if (self.config.colorize) {
					li.innerHTML = color + icon + endSpan + " " + element.summary;
				} else {
					li.innerHTML = icon + " " + element.summary;
				}
				
				if (typeof element.children !== "undefined") {
					let childList = self.renderList(element.children);
					li.appendChild(childList);
				}
				ul.appendChild(li);
			}
		}
		return ul;
	},

	getStyles: function () {
		return [
			"MMM-NextCloud-Tasks.css",
		];
	},

	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-NextCloud-Tasks-Helper-TODOS#" + this.identifier) {
			this.toDoList = payload;
			this.updateDom();
		}
		if(notification === "MMM-NextCloud-Tasks-Helper-LOG#" + this.identifier) {
			Log.log("LOG: ", payload);
		}
		if(notification === "MMM-NextCloud-Tasks-Helper-ERROR#" + this.identifier) {
			Log.error("ERROR: ", payload);
			this.error = payload + "<br>";
			this.updateDom();
		}
	},

	verifyConfig: function (config) {
		if(
			typeof config.listUrl === "undefined" ||
			typeof config.webDavAuth === "undefined" ||
			typeof config.webDavAuth.username === "undefined" ||
			typeof config.webDavAuth.password === "undefined" ||
			typeof config.sortMethod === "undefined" ||
			typeof config.colorize === "undefined"
		) {
			this.error = "Config variable missing";
			Log.error("Config variable missing");
			return false;
		}
		return true;
	}
});
