var earthService = angular.module('earthApp.services', []);

earthService.factory('userService',
    ['$http', function($http) {
    var service = {};


    service.createUser = function (username,password) {
        return $http.post('http://localhost:8888/earthServer/v1/register', {email: username, password: password}, {timeout: 3000});
    }

    return service;
 }]);

earthService.factory('apService',function() {
    var service = {};

    //Receive data from webservice/ Return true when data is saved
    service.saveInfo = function (data) {
        if (data && !(data["error"])) {
//            window.localStorage['Aps'] = JSON.stringify(data['data']);
              return true;
        }
        return false;
    }
    //Return null if no aps are found
    service.getAps = function () {
        var $aps = null;
        if (window.localStorage['Aps']) {
            $aps = JSON.parse(window.localStorage['Aps']);
            for(var i = 0; i < $aps.length; i++) {
                var $ap = $aps[i];
                //hard coding the chutes
                $ap['chutes'].splice(0,$ap['chutes'].length);
                var chuteOne = {name: "Virtual Networks", guid: $ap['guid'], icon:"icon - icon ion-cloud"};
                var chuteTwo = {name: "ISP Test", guid: $ap['guid'], icon:"icon - icon ion-connection-bars"};
                var chuteThree = {name: "Network Statitics", guid: $ap['guid'], icon:"icon - icon ion-arrow-graph-up-right"};
                var chuteFour = {name: "Netflix Caching", guid: $ap['guid'], icon:"icon - icon ion-film-marker"};

                $ap['chutes'] = [chuteOne,chuteTwo, chuteThree, chuteFour];

            }
        }

        return $aps;

    }


    service.getServiceWithAPGUID = function ($GUID) {
        $aps = this.getAps();
        if ($aps) {

        }

    }
    return service;
});


earthService.factory('authentication',
    ['Base64', '$http', '$rootScope',
    function (Base64, $http, $rootScope) {
        var service = {};
        service.Login = function (username, password) {
            return $http.post('http://localhost:8888/earthServer/v1/login', {email: username, password: password}, {timeout: 3000});
            //return $http.post('http://localhost:8888/iParadrop/tempServer/script_login.php', {username: username, password: password, fromMobile:true }, {timeout: 3000});

       };


        service.ClearCredentials = function () {
            delete $rootScope.globals;
            window.localStorage.removeItem('globals');
            window.localStorage.removeItem('Aps');
        };


        service.setCredentials = function (username, apiKey) {
            //var authData = Base64.encode(username + ':' + password);

                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        apiKey: apiKey
                    }
                };
            //console.log("foi aqui no localStorage!");
            window.localStorage['globals'] = JSON.stringify($rootScope.globals);
        };



        return service;
}]);

earthService.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
