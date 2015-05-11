var myEarthService = angular.module('services.activityModel', []);

myEarthService.factory('activityModel', function($q) {
    var service = {};
    var userTodoList;


    service.getUserActivityDoneList = function() {
        var user = new Parse.User.current();
        var activity_user = Parse.Object.extend("ActivityDone_user");
        var deferred  = $q.defer();

        var onSuccess, onError;
        onSuccess = function (results) {
            deferred.resolve(results);
        }

        onError = function (error) {
            deferred.reject("Error: " + error);
        }
        var query = new Parse.Query(activity_user);
        query.limit(1000);
        query.equalTo("user",user);
        query.ascending("createdAt");
        query.include("activity");
        query.find({
            success: onSuccess,
            error: onError
        });

        return deferred.promise;

    }


    service.doActivity = function(activity) {


        var user = Parse.User.current();
        var activity_user = new Parse.Object("ActivityDone_user");
        activity_user.set("user",user);
        activity_user.set("activity", activity);

        var deferred = $q.defer();
        var onSuccess, onError;

        onSuccess = function (activity_user) {
            console.log("OK");
            deferred.resolve("Added User");
        }

        onError = function (activity_user,error) {
            console.log("error");
            deferred.reject("Error");
        }

        activity_user.save(null, {success:onSuccess,error:onError});
        return deferred.promise;
    }


    service.getUniqueActivityByName = function (activityName) {

        var onSuccess,onError;
        var deferred = $q.defer();
        onSuccess = function (results) {

            if (results.length != 0) {
                deferred.resolve(results[0]);
            } else {
                deferred.resolve(null);
            }
        }

        onError = function (error) {
            deferred.reject("error");
        }

        var Activity = Parse.Object.extend("Activity");

        var query = new Parse.Query(Activity);
        query.equalTo("title",activityName);
        query.find({
            success: onSuccess,
            error: onError
        });

        return deferred.promise;
    }


    return service;
});


