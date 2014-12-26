app.controller("settingsController", 
	["$scope", "$http", "$state", "restAPI", "$translate", "$timeout",
	function($scope, $http, $state, restAPI, $translate, $timeout) {
		
		var me = this;
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
		
		this.changeLanguage = function(selected_language){
			console.log('Change to language: ' + selected_language);
			$translate.use(selected_language).then(function(){
				
			});
		}
		
		this.initLanguage = function(){
			$timeout(function(){
				console.log('Active Language on load: ' + $translate.use())
				// set active language
				$scope.language = $translate.use();
			});
		}
}]);