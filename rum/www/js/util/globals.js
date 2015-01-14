app.service("globals", [ function() {
	//VARIABLES
	this.trips = [];
	this.chat;

	//FUNCTIONS
	this.setChat = function(chat) {
		this.chat = chat;
	};

	this.setUser = function(user) {
		this.user = user;

		// init chat
		this.chat.connect();
	};

	this.setReorderCallback = function(callback) {
		this.reorderCallback = callback;
	}

	this.callReorderCallback = function() {
		if (typeof (this.reorderCallback) == "function") {
			this.reorderCallback();
		}
	}

	this.setTripID = function(trip_id) {
		trip_id = parseInt(trip_id);
		if (!isNaN(trip_id) && trip_id >= 0) {
			this.chat.joinTripRoom(trip_id);
		} else if (!isNaN(this.trip_id)) {
			this.chat.leaveTripRoom();
		}
		this.trip_id = trip_id;
		localStorage.setItem("trip_id", trip_id);
	};

	this.checkTripID = function() {
		var ltrip_id = localStorage.getItem("trip_id");
		if (ltrip_id !== null) {
			this.setTripID(ltrip_id);
		}
	};

	this.removeTripID = function() {
		localStorage.removeItem("trip_id");
		delete this.trip_id;
	};
} ]);