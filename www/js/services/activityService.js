var myEarthService = angular.module('services.activityModel', []);


// Maximum number of objects to retrieve in one query.  The Parse API documents
// specify 1000 as the maximum permitted value for this, even though the open
// source Parse server does seem to accept larger limits.
var QUERY_LIMIT = 1000;


// Recursively complete queries that may exceed the individual query limit by
// paging through the results with the skip option and concatenating them.
var recursiveQuery = function(query, deferred, skip, prev_results) {
    // Initialize for the first iteration.
    if (!skip) {
        skip = 0;
    }
    if (!prev_results) {
        prev_results = [];
    }

    query.limit(QUERY_LIMIT);
    query.skip(skip);

    query.find().then(
        function(results) {
            var all_results = prev_results.concat(results);

            if (results.length === QUERY_LIMIT) {
                recursiveQuery(query, deferred, skip+QUERY_LIMIT, all_results);
            } else {
                deferred.resolve(all_results);
            }
        },
        function(error) {
            deferred.reject("Error: " + error);
        }
    );
}


myEarthService.factory('activityModel', function($q) {
    var service = {};
    var userTodoList;


    service.getUserActivityDoneList = function() {
        var user = new Parse.User.current();
        var activity_user = Parse.Object.extend("ActivityDone_user");
        var deferred  = $q.defer();

        var query = new Parse.Query(activity_user);
        query.equalTo("user",user);
        query.ascending("createdAt");
        query.include("activity");

        recursiveQuery(query, deferred);

        return deferred.promise;
    }


    service.doActivity = function(activity) {

        var user = Parse.User.current();
        var activity_user = new Parse.Object("ActivityDone_user");

        user.increment('activityCount');

        if (activity.get('pointCategory') === 'Gallons of Water') {
            user.set('waterSaved', user.get('waterSaved') + activity.get('points'));
        } else {
            user.set('carbonSaved', user.get('carbonSaved') + activity.get('points'));
        }

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


