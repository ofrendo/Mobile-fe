app.controller("settingsController", 
	["$scope",  "$translate", "$timeout",
	function($scope,  $translate, $timeout) {
		
		//VARIABLES
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
		
		//FUNCTIONS
		//changes the language
		this.changeLanguage = function(selected_language){
			console.log('Change to language: ' + selected_language);
			$translate.use(selected_language).then(function(){
				toast.showShort("Hallo")
			});
		}
		
		//sets the active language
		this.initLanguage = function(){
			$timeout(function(){
				console.log('Active Language on load: ' + $translate.use())
				// set active language
				$scope.language = $translate.use();
			});
		}
}]);