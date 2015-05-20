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
        	//Cancel the notification, be careful with id, if changed there it must be changed here
        	window.plugin.notification.local.cancel(1, function () {}, null);

        	Parse.User.logOut();
        	clearLocalStorage();
  			$state.go('login');
        }

    });