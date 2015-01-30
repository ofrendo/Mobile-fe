app.service("globals", [ function() {
	//VARIABLES
	var self = this;
	this.trips = [];
	this.chat;

	//FUNCTIONS
	this.setChat = function(chat) {
		self.chat = chat;
	};

	this.setUser = function(user) {
		self.user = user;

		// init chat
		self.chat.connect();
	};

	this.setReorderCallback = function(callback) {
		this.reorderCallback = callback;
	}
	this.callReorderCallback = function() {
		if (typeof (this.reorderCallback) == "function") {
			this.reorderCallback();
		}
	}
	
	this.setReloadCallback = function(callback) {
		this.reloadCallback = callback;
	}

	this.callReloadCallback = function() {
		if (typeof (this.reloadCallback) == "function") {
			this.reloadCallback();
		}
	}

	this.setOptimizeCallback = function(callback) {
		this.optimizeCallback = callback;
	}
	this.callOptimizeCallback = function() {
		if (typeof (this.optimizeCallback) == "function") {
			this.optimizeCallback();
		}
	}

	this.setTripID = function(trip_id) {
		trip_id = parseInt(trip_id);
		if (!isNaN(trip_id) && trip_id >= 0) {
			self.chat.joinTripRoom(trip_id);
		} else if (!isNaN(this.trip_id)) {
			self.chat.leaveTripRoom();
		}
		self.trip_id = trip_id;
		localStorage.setItem("trip_id", trip_id);
	};

	this.checkTripID = function() {
		var ltrip_id = localStorage.getItem("trip_id");
		if (ltrip_id !== null) {
			self.setTripID(ltrip_id);
		}
	};

	this.removeTripID = function() {
		localStorage.removeItem("trip_id");
		delete self.trip_id;
	};
} ]);