var paradropCtrl = angular.module('controllers.main', ['ionic.utils']);


paradropCtrl.controller('mainCtrl',
    function($scope, $state, $localStorage) {

    	var clearLocalStorage = function() {
    
		    var lastUserEmail = $window.localStorage['lastUserEmail'];
		    console.log(lastUserEmail);
		    $window.localStorage.clear();
		    $window.localStorage['lastUserEmail'] = lastUserEmail;

		}


        $scope.logout = function () {
        	
        	cordova.plugins.notification.local.cancel(1, function () {
			    console.log('notif cancelled');
			}, null);

        	Parse.User.logOut();
        	clearLocalStorage();
  			$state.go('login');
        }

    });