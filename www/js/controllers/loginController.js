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

        if ($scope.loginData && $scope.loginData.username && $scope.loginData.password) {

            console.log('parse request: user login');
            Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
                success: function(privUser) {

                    $ionicLoading.hide();
                    $state.go('app.timeline');

                },

                error: function(user, error) {
                    // The login failed. Check error to see why.
                    $ionicLoading.hide();

                    $ionicPopup.alert({
                        title: 'Login Failed',
                        template: "<p>Username/Password combination is incorrect.</p>",
                        okText: 'OK'
                    });
                    
                    console.log("login failed: " + error.message);
                }
            });


        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Blank Fields',
            template: "<p>You must enter a username and password to log in.</p>",
            okText: 'OK'
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

        var query = new Parse.Query(Parse.User);
        query.equalTo("username", email);

        console.log('parse request: check email to reset password');
        query.find({
          success: function(users) {

                if (users.length > 0) {
                    
                    $scope.closeForgot();
                    sendNewPasswordEmail(email);
                
                } else {
                    
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "<p>Could not find user account.</p>",
                        okText: 'OK'
                    });
                }

            }
        });
    }

    function sendNewPasswordEmail(email) {

        console.log('parse request: send password reset email');
        Parse.User.requestPasswordReset(email, {
            success:function() {
                $ionicPopup.alert({
                    title: 'Email Sent Successfully'
                });
            },
            error:function(error) {
                $ionicPopup.alert({
                  title: error
                  });
            }
        });
    } 




    // ---------------------- close Modal ---------------------
    $scope.closeSignUp = function () {
        $scope.modal.hide();
    }

});