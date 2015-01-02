app.controller("chatController", 
	["$scope", "$http", "$state", "$timeout", "$ionicScrollDelegate", "globals", "restAPI",
	function($scope, $http, $state, $timeout, $ionicScrollDelegate, globals, restAPI) {

	console.log("----INIT chat.js controller----");
	$scope.messages = [];

	var socket;
	//Call this to connect to server - only AFTER log in
	var chat = {};
	chat.connect = function() {
		var url = (restAPI.url.indexOf("https") !== -1) 
				  ? restAPI.url + ":443"
				  : restAPI.url;
		socket = io.connect(url, {
			reconnection: false
		});	

		//This is called upon establishing a connection with the server
		socket.on("connect", function() {
			console.log("Chat WS connected to server.");
		});

		//This is called upon entering a room, recieving the previous 100 messages
		socket.on("room.previousMessages", function(previousMessages) {
			console.log("Joined room for trip " + globals.trip_id + ":");
			console.log(previousMessages);
			$scope.messages = [];
			for (var i = 0; i < previousMessages.length; i++) {
				var msg = previousMessages[i];
				pushMessage(msg);
			}
			scrollToBottom();
		});

		//This is called when a new user joins the room
		socket.on("room.userJoined", function(user) {
			//user.user_id, user.username, user.name
		});

		//This is called to confirm that a message was sent
		socket.on("msg.sent", function(message) {
			console.log("Message \"" + message.msg_text + "\" confirmed:");
			console.log(message);
			console.log($scope.messages);
			for (var i = $scope.messages.length-1; i >= 0; i--) {
				if ($scope.messages[i].confirmed === false && $scope.messages[i].msg_text === message.msg_text) {
					$scope.$apply(function() {
						$scope.messages[i] = message;
					});
				}
			}
		});

		//This is called when a new message was sent by a different user
		socket.on("msg.new", function(message) {
			pushMessage(message);
			scrollToBottom();
		});
	};

	//Call this to join the chat room for a certain trip
	chat.joinTripRoom = function(trip_id) {
		console.log("Joining room for trip " + trip_id + "...");
		var room = {trip_id: trip_id};
		socket.emit("room.join", room);
	};

	//Call this to leave the current trip chat room
	chat.leaveTripRoom = function() {
		console.log("Leaving room.");
		socket.emit("room.leave");
	};


	globals.setChat(chat);

	//Call this to send the currently entered message 
	$scope.sendMsg = function() {
		var msg_text = $scope.msgText;
		console.log('Sending message "' + msg_text + '"');

		var message = {msg_text: msg_text};
		socket.emit("msg.send", message);
		
		message.confirmed = false;
		
		// add user data for the offline message
		message.user_id = globals.user.user_id;
		message.name = globals.user.name;
		message.username = globals.user.username;
		message.avatar = globals.user.avatar;
		console.log(globals.user);
		message.created_on = 'sending...';
		
		pushMessage(message);

		// reset input field for message
		$scope.msgText = "";
		// scroll to bottom
		scrollToBottom();
	};

	$scope.isOwnMessage = function(user) {
		return user.username == globals.user.username;
	};

	function pushMessage(message) {
		if (!$scope.$$phase) {
			$scope.$apply(function() {
				pushMessageToScope(message);
			});
		}
		else {
			pushMessageToScope(message);
		}
	}

	function pushMessageToScope(message) {
		$scope.messages.push(message);	
	}

	function scrollToBottom() {
		$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
	}
}]);