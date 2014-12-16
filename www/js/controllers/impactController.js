var paradropCtrl = angular.module('controllers.impact',[]);

paradropCtrl.controller('impactCtrl',
    function($scope, $state) {

    	var lbsCarbonSavedThisWeek = 168;
            //TODO: Create service for this.


    	var conversionMultiplier = .04088161;
    	var secondaryMultiplier = .559159;

    	$scope.carbonSaved = Math.round(lbsCarbonSavedThisWeek);

    	$scope.tier = Math.floor(lbsCarbonSavedThisWeek * conversionMultiplier * secondaryMultiplier) + 1;

    	if ($scope.tier > 5) {
    		$scope.tier = 5;
    	}

    	$scope.progressToNextLevel = "";

    	if ($scope.tier < 5) {
    		var carbonToSaveForNextLevel = ($scope.tier) / conversionMultiplier / secondaryMultiplier;
    		var progressToNext = Math.ceil(carbonToSaveForNextLevel - lbsCarbonSavedThisWeek);

    		console.log($scope.tier + 1)
    		console.log(carbonToSaveForNextLevel);
    		console.log(lbsCarbonSavedThisWeek);

    		$scope.progressToNextLevel = "You need to save " + progressToNext + " more pounds this week to advance to the next level.";

    		if (progressToNext == 1) {
    			$scope.progressToNextLevel = "You need to save " + progressToNext + " more pound this week to advance to the next level.";
    		}

    	} else {
    		$scope.progressToNextLevel = "Congratulations! You've done well this week.";
    	}

    	//use tier number to change graphic number


    });