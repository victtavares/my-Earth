var paradropCtrl = angular.module('controllers.main',[]);


paradropCtrl.controller('mainCtrl',
    function($scope, $state) {

        $scope.logout = function () {
        	Parse.User.logOut();
  			$state.go('login');
        }

    });