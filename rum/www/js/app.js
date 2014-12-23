// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}]);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "partials/menu.html",
      controller: 'menuController as menuCtrl'
    })
    
    .state('app.tripList', {
      url: "/tripList",
      views: {
        'menuContent' :{
          templateUrl: "partials/tripList.html",
          controller: 'tripListController as tripListCtrl'
        }
      }
    })
  
  	.state('app.cityList', {
      url: "/cityList/:trip_id",
      views: {
        'menuContent' :{
          templateUrl: "partials/cityList.html",
          controller: 'cityListController as cityListCtrl'
        }
      }
    })
    
    .state('app.addTrip', {
      url: "/addTrip",
      views: {
        'menuContent' :{
          templateUrl: "partials/addTrip.html",
          controller: 'addTripController as addTripCtrl'
        }
      }
    })
    
    .state('app.editTrip', {
      url: "/editTrip/:trip_id",
      views: {
        'menuContent' :{
          templateUrl: "partials/editTrip.html",
          controller: 'editTripController as editTripCtrl'
        }
      }
    })
    
    .state('app.addParticipants', {
    	url: "/addParticipants",
    	views: {
    		'menuContent' :{
    			templateUrl: "partials/addParticipants.html",
    			controller: 'addParticipantController as addParticipantCtrl'
    		}
    	}
    })
    
    .state('app.addCity', {
      url: "/addCity/:trip_id",
      views: {
        'menuContent' :{
          templateUrl: "partials/addCity.html",
          controller: 'addCityController as addCityCtrl'
        }
      }
    })
    
    .state('app.editCity', {
      url: "/editCity/:trip_id/:city_id",
      views: {
        'menuContent' :{
          templateUrl: "partials/editCity.html",
          controller: 'editCityController as editCityCtrl'
        }
      }
    })
    
    .state('app.locationList', {
      url: "/locationList/:trip_id/:city_id",
      views: {
        'menuContent' :{
          templateUrl: "partials/locationList.html",
          controller: 'locationListController as locationListCtrl'
        }
      }
    })
    
    .state('app.addLocation', {
      url: "/addLocation/:trip_id/:city_id",
      views: {
        'menuContent' :{
          templateUrl: "partials/addLocation.html",
          controller: 'addLocationController as addLocationCtrl'
        }
      }
    })
  
	  .state('app.login', {
	      url: "/login",
	      views: {
	        'menuContent' :{
	          templateUrl: "partials/login.html",
	          controller: 'loginController as loginCtrl'
	        }
	      }
	    })
  
	  .state('app.register', {
	      url: "/register",
	      views: {
	        'menuContent' :{
	          templateUrl: "partials/register.html",
	          controller: 'registerController as registerCtrl'
	        }
	      }
	    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});

