var paradropCtrl = angular.module('controllers.impact',[]);

paradropCtrl.controller('impactCtrl',
    function($scope, $state, activityDoneList) {

    if(typeof analytics !== "undefined") {
        analytics.trackView('My Impact');
    }
        bearImage = Parse.User.current().get('bearImage');
        console.log(bearImage);

        $scope.bearOrForest = 'forest';

        if (bearImage) {
            $scope.bearOrForest = 'polarBear';
        }

		var getTotalPointsSaved = function () {
			var activity;
			var returnData = [0,0];
			for (i = 0; i < activityDoneList.length; i++) {
				activity = activityDoneList[i].get("activity");
				if (activity.get("pointCategory") == "Pounds of Carbon") {
					returnData[0] = returnData[0] + activity.get("points");
				} else {
					returnData[1] = returnData[1] + activity.get("points");
				}
			}

			return returnData;
		}

		var totalPoints = getTotalPointsSaved();
		console.log(totalPoints);
    	var lbsCarbonSavedThisWeek = totalPoints[0];

    	var conversionMultiplier = .04088171;
    	var secondaryMultiplier = 2.6;

    	$scope.carbonSaved = Math.round(lbsCarbonSavedThisWeek * 100) / 100;

    	$scope.tier = Math.floor(lbsCarbonSavedThisWeek * conversionMultiplier * secondaryMultiplier) + 1;

    	if ($scope.tier > 7) {
    		$scope.tier = 7;
    	}

    	$scope.progressToNextLevel = "";

        var percentDone;

    	if ($scope.tier < 7) {
    		var carbonToSaveForNextLevel = ($scope.tier) / conversionMultiplier / secondaryMultiplier;
    		var progressToNext = Math.ceil(carbonToSaveForNextLevel - lbsCarbonSavedThisWeek);

            var carbonToSaveForPrevLevel = (($scope.tier) - 1 ) / conversionMultiplier / secondaryMultiplier;
            var thisLevelsBeginning = Math.ceil(carbonToSaveForPrevLevel);

            console.log(carbonToSaveForPrevLevel + " and " + carbonToSaveForNextLevel);
            console.log(progressToNext + " from "  + thisLevelsBeginning);

    		$scope.progressToNextLevel = "Keep up the good work! You have to save " + progressToNext + " more pounds this week to advance to the next level.";

    		if (progressToNext == 1) {
    			$scope.progressToNextLevel = "Keep up the good work! You have to save " + progressToNext + " more pound this week to advance to the next level.";
    		}

            percentDone = 100*(lbsCarbonSavedThisWeek - thisLevelsBeginning)/(carbonToSaveForNextLevel - thisLevelsBeginning);

    	} else {
            $scope.congrats = true;
    		$scope.progressToNextLevel = "You've done incredibly well this week.";
            percentDone = 100;
    	}

        $scope.percentDone = percentDone;

    	//use tier number to change graphic number


    });