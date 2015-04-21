var myEarthCtrl = angular.module('controllers.calc',[]);


myEarthCtrl.controller('calcCtrl', function($scope) {

    if(typeof analytics !== "undefined") {
    	analytics.trackView('Calculations');
    }

    $scope.showBrowserPage = function(url) {
    	window.open(url, '_blank', 'location=yes');
    }

});