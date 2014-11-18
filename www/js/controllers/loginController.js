var myEarthCtrl = angular.module('controllers.login',[
    'services.auth',
    'services.model.users'
    ]);

myEarthCtrl.controller('loginCtrl',
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

        // ---------------------- Loading Forgot Modal ---------------------
        $ionicModal.fromTemplateUrl('templates/forgot.html', function($ionicModal) {

            $scope.forgotData = {};
            $scope.forgotmodal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });



        // ---------------------- close forgot Modal ---------------------
        $scope.closeForgot = function () {
            $scope.forgotmodal.hide();
        }


        $scope.checkUserInfoForNewPass = function () {

            var email = $scope.forgotData.email;

            //TODO: check if email is found then sendNewPasswordEmail

            //if found
            $scope.closeForgot();
            sendNewPasswordEmail(email);

            //if not found
            $ionicPopup.alert({
                title: 'Authentication Error',
                template: "<p>Email not found.</p>",
            });

        }

        function sendNewPasswordEmail(email) {

            //TODO: SEND PASSWORD RESET EMAIL

        } 




        // ---------------------- close Modal ---------------------
        $scope.closeSignUp = function () {
            $scope.modal.hide();
        }



    });