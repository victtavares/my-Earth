var paradropCtrl = angular.module('controllers.timeline',[
    'services.model.activities'
]);

paradropCtrl.controller('timelineCtrl',
    function($scope,$ionicModal, modelActivity, $state) {


        // ---------------------- Loading Modal ---------------------
        $ionicModal.fromTemplateUrl('templates/addActivities.html', function($ionicModal) {

            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });

        // ---------------------- close Modal ---------------------
        $scope.closeModalButton = function () {
            $scope.modal.hide();
        }


        $scope.activityList = [{activityName: "Walk Home", activityDescription: "You saved 3 trees!"},
            {activityName: "Refill Water Bottle", activityDescription: "You saved 2 trees!"}];


        $scope.allActivitiesList = modelActivity.getAll();

        $scope.addActivity = function ($index) {
            console.log("index: " + $index);
        }


    });