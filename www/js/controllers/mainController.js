var paradropCtrl = angular.module('controllers.main',['services.auth']);


paradropCtrl.controller('mainCtrl',
    function($scope, authentication) {
        $scope.logout = function () {
            authentication.ClearCredentials();
        }
    });