
var app = angular.module('earthApp', [
    'ionic',
    'controllers.login',
    'controllers.register',
    'controllers.main',
    'controllers.timeline',
    'controllers.impact',
    'controllers.profile',
    'controllers.selectToDo'
]);



app.run(function($ionicPlatform,$rootScope,$state,$http) {

   // When the user is going to another page!
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
        // redirect to mainPage if logged in
        if (window.localStorage['globals']) {
            $rootScope.globals = JSON.parse(window.localStorage['globals']);
            if (toState.name == 'login' && $rootScope.globals.currentUser) {
                event.preventDefault();
                $state.go('app.timeline');
                console.log("We're going to the loginPage!");

            }
        }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    //Convert the HTTP method to a format that php can understand
    //http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $http.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});


app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url:"/",
            templateUrl:"templates/login.html",
            controller:"loginCtrl"
        })

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller:"mainCtrl"
        })

        .state('app.timeline', {
            url: "/timeline",
            views: {
                "menuContent" :{
                    templateUrl: "templates/timeline.html",
                    controller:'timelineCtrl'
                }
            }
        })

        .state('app.selectToDoList', {
            url: "/selectToDoList",
            views: {
                "menuContent" :{
                    templateUrl: "templates/selectToDoList.html",
                    controller:'selectToDoCtrl'
                }
            }
        })

        .state('app.impact', {
            url: "/impact",
            views: {
                "menuContent" :{
                    templateUrl: "templates/impact.html",
                    controller:'impactCtrl'
                }
            }
        })

        .state('app.profile', {
            url: "/profile",
            views: {
                "menuContent" :{
                    templateUrl: "templates/profile.html",
                    controller:'profileCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    if(Parse.User.current()) {
      $urlRouterProvider.otherwise('/app/timeline');
    } else {
      $urlRouterProvider.otherwise('/');
    }
});

