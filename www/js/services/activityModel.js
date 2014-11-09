var earthService = angular.module('services.model.activities', []);


earthService.factory('modelActivity',
    ['$http', function($http) {
        var service = {};
        var activityOne = {id:0,
            activityName: "Walk Home",
            activityDescription: "Did you walk home today instead of get a bus? Great! You just saved 3 trees!",
            points: "3 points"};
        var activityTwo = {id:1,
            activityName: "Refill water bottle",
            activityDescription: "Did you walk refill your water bottle instead of buy a new one? Great! You just saved 2 trees!",
            points: "2 points"
        };
        var activityThree = {id:2,
            activityName: "Wash car with bucket",
            activityDescription: "Did you wash your car with a bucket today instead of get use a hose? Great! You just saved 5 trees!",
            points: "5 points"
            };
        var activities = [activityOne, activityTwo, activityThree];



        service.getAll = function () {
            return activities;
        };

        return service;
    }]);