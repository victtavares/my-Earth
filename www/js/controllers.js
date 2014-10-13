

var paradropCtrl = angular.module('earthApp.controllers',['earthApp.services']);


//############################################## userController  ##############################################

paradropCtrl.controller('userController',
        function ($scope, $rootScope,$ionicPopup,$ionicLoading,$state, authentication, apService, $ionicModal, userService) {

            // ---------------------- Login Function ---------------------
            $scope.login = function () {
               // Loading...
                $ionicLoading.show({
                    template: 'Loading...'
                });
                //Authentication service = connect to the PHP API
                if (($scope.loginData) && ($scope.loginData.password) && ($scope.loginData.username)) {
                    authentication.Login($scope.loginData.username, $scope.loginData.password)
                        .success(function (data) {
                            //console.log(data);
                            $ionicLoading.hide();
                            if (apService.saveInfo(data)) {
                                authentication.setCredentials($scope.loginData.username, data["apiKey"]);
                                $state.go('app.timeline');

                            } else {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Authentication Error',
                                    template: "<p>Username or Password is not correct</p>",
                                    okText: 'Cancel'
                                });
                            }

                        })
                        .error(function (data) {
                            console.log("this is the data" + data);
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Connection Error',
                                template: "<p>Server connection failure</p>",
                                okText: 'Cancel'
                            });
                        });
                } else {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Blank fields',
                        template: "<p>A username and password must be entered</p>",
                        okText: 'Cancel'
                    });
                }

            };


            // ---------------------- Loading Modal ---------------------
            $ionicModal.fromTemplateUrl('templates/register.html', function($ionicModal) {

                $scope.modal = $ionicModal;
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });



            // ---------------------- Sign up ---------------------
            $scope.signUp = function () {

                $scope.registerData = {};
                $ionicLoading.show({
                    template: 'Loading...'
                });
                if (($scope.registerData) && ($scope.registerData.password) && ($scope.registerData.username)) {
                    userService.createUser($scope.registerData.username, $scope.registerData.password)
                        .success(function (data) {
                            console.log(data);
                            $ionicLoading.hide();
                            if (!data['error']) {
                                $scope.modal.hide();
                                $state.go('app.timeline');

                            } else {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Register Error',
                                    template: "<p>" +data["message"] +"</p>",
                                    okText: 'Cancel'
                                });
                            }

                        })
                        .error(function (data) {
                            console.log("this is the data" + data);
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Connection Error',
                                template: "<p>Server connection failure</p>",
                                okText: 'Cancel'
                            });
                        });
                } else {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Blank fields',
                        template: "<p>A username and password must be entered</p>",
                        okText: 'Cancel'
                    });
                }


            }



            // ---------------------- close Modal ---------------------
            $scope.closeSignUp = function () {
                $scope.modal.hide();
            }



        });





//############################################## timelineController  ##############################################


paradropCtrl.controller('apListController',
        function($scope, apService) {

            $scope.groups = [];
            var $aps = apService.getAps();
            if ($aps) {
                for(var i = 0; i < $aps.length; i++) {
                    var $ap = $aps[i];
                    //populating the groups
                    $scope.groups[i] = {
                        name: $ap['name'],
                        items:$ap['chutes']
                    };
                }
            }

            $scope.toggleGroup = function(group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }
            };

            $scope.isGroupShown = function(group) {
                return $scope.shownGroup === group;
            };


        });



//############################################## mainController  ##############################################


paradropCtrl.controller('MainController',
    function($scope, authentication) {
        //console.log("foi no mainController");
        $scope.logout = function () {
            //console.log("foi no logout");
            authentication.ClearCredentials();
        }
    });

paradropCtrl.directive('MyPatientSection', function() {
    return 'test';

});