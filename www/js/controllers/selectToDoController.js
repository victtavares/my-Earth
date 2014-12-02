var paradropCtrl = angular.module('controllers.selectToDo', ['ionic.utils']);

paradropCtrl.controller('selectToDoCtrl',
    function($scope, $state, $ionicLoading, $localStorage) {

        $ionicLoading.show({
            template: 'Loading...'
        });

        // if ($localStorage.get('firstLogin')) {
            // $document.getObjectByID('menuButton').hidden = true;
        // }


        //Get Activity List from Parse, group by activity Category

        $scope.categoryList = [];

        var query = new Parse.Query('Activity');
        console.log('parse request: get activity list');
        
        query.find({
            
            success: function(activities) {

                var activityList = [];

                for (var i = 0; i < activities.length; i++) {

                    var activity = {
                        activityName: activities[i].get('title'), 
                        activityCategory: activities[i].get('category'),
                    };
                      
                    activityList.push(activity);
                }

                generateCategoryList(activityList);

                $ionicLoading.hide();

            },
            
            error: function(error) {
                
                // The connection failed. Check error to see why.
                $ionicLoading.hide();

                $state.go('logout');

                $ionicPopup.alert({
                    title: 'Connection Failed',
                    template: "<p>Please Try Again.</p>",
                    okText: 'OK'
                });

            }
        
        });

        //generates $scope.categoryList from list of activities
        function generateCategoryList(activList) {

            for (var i = 0; i < activList.length; i++) {

                var activity = activList[i];

                if (isInCategoryList(activity.activityCategory)) {
                    
                    for (var j = 0; j < $scope.categoryList.length; j++) {
                        category = $scope.categoryList[j];
                        if (category.title === activity.activityCategory) {
                            category.activities.push({name: activity.activityName});
                            console.log("Update category: " + activity.activityCategory + ", activity: " + activity.activityName);
                            break;
                        }
                    }

                } else {
                    console.log("Add category: " + activity.activityCategory + ", activity: " + activity.activityName);
                    $scope.categoryList.push({title: activity.activityCategory, activities: [{name: activity.activityName}]});
                }

            }
        }

        //returns true if this category exists in the list

        function isInCategoryList(categoryName) {

            for (var i = 0; i < $scope.categoryList.length; i++) {
                if ($scope.categoryList[i].title == categoryName) {
                    return true;
                }
            }
            return false;
        }


        $scope.saveSelection = function() {

            $state.go('app.timeline');

        }

    });