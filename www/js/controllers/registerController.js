var myEarthCtrl = angular.module('controllers.register',[
    'services.auth',
    'services.model.users'
]);


myEarthCtrl.controller('registerCtrl',
    function ($scope, $rootScope,$ionicPopup,$ionicLoading,$state, authentication, $ionicModal, modelUser) {

     // ---------------------- Sign up ---------------------
        $scope.signUp = function () {

            //$scope.registerData = {};
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

    });
