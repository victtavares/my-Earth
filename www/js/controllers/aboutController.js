var myEarthCtrl = angular.module('controllers.about',[]);


myEarthCtrl.controller('aboutCtrl',
    function() {

    if(typeof analytics !== "undefined") {
    	analytics.trackView('About');
    }

});