app.controller("settingsController", 
	["$scope", "$http", "$state", "restAPI", "$translate",
	function($scope, $http, $state, restAPI, $translate) {
		
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
			console.log('Active Language on load: ' + $translate.use())
			// set active language
			$scope.language = $translate.use();
		}
}]);