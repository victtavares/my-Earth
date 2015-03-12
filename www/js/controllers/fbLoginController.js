angular.module('controllers.facebookLogin', ['ngCordova', 'ionic.utils'])

.controller('FacebookLoginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading) {        

    console.log('load fb login ctrl');

    var loginParse = function(authData) {
        console.log('Login to Parse');

        $ionicLoading.show({
          template: '<i class="ion-loading-c" style="font-size: 50px; color: white"></i>',
          noBackdrop: true,
          hideOnStateChange: true
        });

        var fbResponse;

        facebookConnectPlugin.api('/me', null, 
            function(response) {

                fbResponse = response;
                Parse.FacebookUtils.logIn(authData, {
                  success: function(user) {

                    var authData = user.get('authData');

                    $scope.fbUserData = {};
                    $scope.fbUserData.gender = fbResponse.gender.substring(0,1).toUpperCase();
                    $scope.fbUserData.firstName = fbResponse.first_name;
                    $scope.fbUserData.lastName = fbResponse.last_name;
                    $scope.fbUserData.email = fbResponse.email;
                    $scope.fbUserData.link = fbResponse.link;

                },
                  error: function(user, error) {
                    console.log("User cancelled the Facebook login or did not fully authorize.");
                    console.log(error);
                    $ionicLoading.hide();
                    console.log('hide ionic loading 4');
                  }
                });
            },
            function(error) {
                console.log('error 1');
                console.log(error);
                $ionicPopup.alert({
                  title: 'Uh Oh!',
                  template: 'Could not retrieve Facebook information.'
                });
                $ionicLoading.hide();
                facebookConnectPlugin.logout(null, null);
                return;
            }
        );
    };

    var afterParseLogin = function(user) {

    	//called no matter what info was retrieved from fb. user can enter his own damn shit lol

    	if (!user.existed()) {
	      	
	      	console.log("User account needs linking!");
	      	$ionicLoading.hide();

		} else {

		      console.log("User logged in through Facebook!");
		      if (user.get('email') == undefined){
                $scope.parseLoginSuccess(user);
              }
	    }
    }

    var fbLogged = new Parse.Promise();

    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            console.log('cannot find');
            return;
        }
        var expDate = new Date(
            new Date().getTime() + response.authResponse.expiresIn * 1000
        ).toISOString();

        var authData = {
            id: String(response.authResponse.userID),
            access_token: response.authResponse.accessToken,
            expiration_date: expDate
        }
        fbLogged.resolve(authData);
        fbLoginSuccess = null;
        console.log(response);
    };

    var fbLoginError = function(error){
    	console.log('rejection');
    	$ionicLoading.hide();
        console.log('hide ionic loading');
        fbLogged.reject(error);
    };

    var logoutSuccess = function() {
    	console.log('fb logout success. logging in.');
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
    }

    var logoutError = function() {
    	console.log('logout error');
    }

    $scope.loginFB = function() {
        console.log('Login via FB');

        if (!facebookConnectPlugin){
            $ionicPopup.alert({
              title: 'Oops!',
              template: 'You lack the Facebook plugin. Login through email/password or use a mobile device.'
            });
        }

        facebookConnectPlugin.logout(logoutSuccess, logoutError);

        fbLogged.then( function(authData) {
            console.log('Promised');
            return loginParse(authData);
        })

    };


});