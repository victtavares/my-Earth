var paradropCtrl = angular.module('controllers.impact',[]);

paradropCtrl.controller('impactCtrl',
    function($scope, $state) {

    	var lbsCarbonSavedThisWeek = 140;
            //TODO: Create service for this.


    	var conversionMultiplier = .04088161;
    	var secondaryMultiplier = .559159;

    	$scope.carbonSaved = Math.round(lbsCarbonSavedThisWeek);

    	$scope.tier = Math.floor(lbsCarbonSavedThisWeek * conversionMultiplier * secondaryMultiplier) + 1;

    	if ($scope.tier > 5) {
    		$scope.tier = 5;
    	}

    	$scope.progressToNextLevel = "";

        var percentDone;

    	if ($scope.tier < 5) {
    		var carbonToSaveForNextLevel = ($scope.tier) / conversionMultiplier / secondaryMultiplier;
    		var progressToNext = Math.ceil(carbonToSaveForNextLevel - lbsCarbonSavedThisWeek);

            var carbonToSaveForPrevLevel = (($scope.tier) - 1 ) / conversionMultiplier / secondaryMultiplier;
            var thisLevelsBeginning = Math.ceil(carbonToSaveForPrevLevel);

            console.log(carbonToSaveForPrevLevel + " and " + carbonToSaveForNextLevel);
            console.log(progressToNext + " from "  + thisLevelsBeginning);

    		$scope.progressToNextLevel = "You need to save " + progressToNext + " more pounds this week to advance to the next level.";

    		if (progressToNext == 1) {
    			$scope.progressToNextLevel = "You need to save " + progressToNext + " more pound this week to advance to the next level.";
    		}

            percentDone = 100*(lbsCarbonSavedThisWeek - thisLevelsBeginning)/(carbonToSaveForNextLevel - thisLevelsBeginning);

    	} else {
    		$scope.progressToNextLevel = "Congratulations! You've done well this week.";
            percentDone = 100;
    	}

        $scope.percentDone = percentDone;

    	//use tier number to change graphic number


    });