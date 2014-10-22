var earthService = angular.module('services.model.users', []);


earthService.factory('modelUser',
    ['$http', function($http) {
        var service = {};


        service.createUser = function (username,password) {
            return $http.post('http://localhost:8888/earthServer/v1/register', {email: username, password: password}, {timeout: 3000});
        }

        return service;
    }]);