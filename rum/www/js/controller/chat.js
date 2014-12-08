app.controller("chatController", ["$scope", "$http", "$state", function($scope, $http, $state) {
	this.messages = msgs;
	
	// send message to server
	this.sendMsg = function(){
		console.log('Send message "' + $scope.msgText + '"');
		// reset input field for message
		$scope.msgText = "";
	};
}]);

// demo data for chat
var msgs = [
	{
		id: 1,
		msg_text: 'Hey, Urlaub in Entenhausen? Wie sieht\'s aus?',
		created_on: new Date(),
		user: {
			id: 1,
			me: true,
			username: 'Matthias',
			avatar: 'http://www.gravatar.com/avatar/61e2363d217e04f8b83b9c02a797e3fa?d=identicon'
		}
	},
	{
		id: 2,
		msg_text: 'Och nö, keinen Bock auf die...',
		created_on: new Date(),
		user: {
			id: 2,
			username: 'Jörn',
			avatar: 'http://www.gravatar.com/avatar/4a6812ecb85aa79fc1358179c85cf9f2?d=identicon'
		}
	},
	{
		id: 3,
		msg_text: 'blubb.',
		created_on: new Date(),
		user: {
			id: 1,
			me:true,
			username: 'Matthias',
			avatar: 'http://www.gravatar.com/avatar/61e2363d217e04f8b83b9c02a797e3fa?d=identicon'
		}
	},
	{
		id: 4,
		msg_text: 'blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. blubb. ',
		created_on: new Date(),
		user: {
			id: 2,
			username: 'Jörn',
			avatar: 'http://www.gravatar.com/avatar/4a6812ecb85aa79fc1358179c85cf9f2?d=identicon'
		}
	}
];