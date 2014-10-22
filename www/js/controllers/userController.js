var paradropCtrl = angular.module('controllers.users',[
    'services.auth',
    'services.model.users'
]);

paradropCtrl.controller('userCtrl',
    function ($scope, $rootScope,$ionicPopup,$ionicLoading,$state, authentication, $ionicModal, modelUser) {

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
                        $ionicLoading.hide();
                        if (data && (!data['error'])) {
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
                modelUser.createUser($scope.registerData.username, $scope.registerData.password)
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