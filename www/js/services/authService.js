var earthService = angular.module('services.auth', []);
//return 200 when the authentication is valid
//return error message if the auth is not valid
//return 400 if found a error connecting

earthService.factory('authentication',
    ['$http', '$rootScope',
        function ($http, $rootScope) {
            var service = {};
            service.Login = function (username, password) {
                return $http.post('http://localhost:8888/earthServer/v1/login', {email: username, password: password}, {timeout: 3000});
            };


            service.ClearCredentials = function () {
                delete $rootScope.globals;
                window.localStorage.removeItem('globals');
            };


             service.setCredentials = function (username, apiKey) {
                //var authData = Base64.encode(username + ':' + password);

                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        apiKey: apiKey
                    }
                };
                window.localStorage['globals'] = JSON.stringify($rootScope.globals);
            };



            return service;
        }]);

