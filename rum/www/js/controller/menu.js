app.controller("menuController", ["$ionicSideMenuDelegate", "$scope","$timeout", function($ionicSideMenuDelegate, $scope , $timeout){
	

	$scope.checkRight = function(){
		//�berpr�fe ob chat angezeigt werden soll
		//return:
		//true enabled
		//false disabled
		return true;
	};
	
	$scope.checkLeft = function(){
		//�berpr�fe ob men� angezeigt werden soll
		//return:
		//true enabled
		//false disabled
		return true;
	};
	
	
}]);