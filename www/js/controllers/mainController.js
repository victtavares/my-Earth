var paradropCtrl = angular.module('controllers.main', ['ionic.utils']);


paradropCtrl.controller('mainCtrl',
    function($scope, $state, $localStorage, $window) {

        console.log("mainCtrl");
    	var clearLocalStorage = function() {
    
		    var lastUserEmail = $window.localStorage['lastUserEmail'];
		    console.log(lastUserEmail);
		    $window.localStorage.clear();
		    $window.localStorage['lastUserEmail'] = lastUserEmail;

		}


        $scope.logout = function () {
        	//Cancel the notification, be careful with id, if changed there it must be changed here
        	clearLocalStorage();
            console.log("logout the user")
            Parse.User.logOut();
            //Will be nil when testing on browser.
            if ($window.plugin) {
                $window.plugin.notification.local.cancel(1, function () {}, null);
            }
            
  			$state.go('login');
        }

    });