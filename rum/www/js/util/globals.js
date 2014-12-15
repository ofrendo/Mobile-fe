app.service("globals", [function() {
	this.trips = [];
	this.chat;

	this.setChat = function(chat) {
		this.chat = chat;
	}

	this.setUser = function(user) {
		this.user = user;

		//init chat
		this.chat.connect();
	}

	this.setTripID = function(trip_id) {
		if (!isNaN(trip_id) && trip_id >= 0) {
			this.chat.joinTripRoom(trip_id);
		}
		else if (!isNaN(this.trip_id)) {
			this.chat.leaveTripRoom();
		}
		this.trip_id = trip_id;
	}
}]);