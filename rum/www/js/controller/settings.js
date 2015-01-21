app.controller("settingsController", 
	["$scope",  "$translate", "$timeout", "restAPI", "globals", "loginService",
	function($scope,  $translate, $timeout, restAPI, globals, loginService) {
		
		//VARIABLES
		var me = this;
		$scope.pw = {};
		this.languages = 
			[
			 {
				 key: 'GERMAN',
				 short: 'de'
			 },
			 {
				 key: 'ENGLISH',
				 short: 'en'
			 }
			];
		
		//INIT
		console.log("----INIT settingsController----");
		loginService.onInit(function(){
			globals.setTripID(-1);
			getAccountData();
		});
		
		//FUNCTIONS
		//changes the language
		this.changeLanguage = function(selected_language){
			console.log('Change to language: ' + selected_language);
			$translate.use(selected_language).then(function(){
				console.log('-> successfully changed.');
			});
		};
		
		//sets the active language
		this.initLanguage = function(){
			$timeout(function(){
				console.log('Active Language on load: ' + $translate.use())
				// set active language
				$scope.language = $translate.use();
			});
		};
		
		// save user data
		this.saveUser = function() {
			console.log('save user: ');
			console.log($scope.user);
			restAPI.user.update($scope.user.user_id, {user: $scope.user}, function(){
				console.log('user data successfully saved');
			});
		};
		
		// save password
		this.savePassword = function(){
			console.log('save password:');
			console.log($scope.pw);
		};
		
		// get the user data from backend
		function getAccountData(){
			restAPI.user.read(globals.user.user_id, function(user){
				console.log(user);
				$scope.user = user;
			});
		}
}]);