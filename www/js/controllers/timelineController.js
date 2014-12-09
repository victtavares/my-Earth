var paradropCtrl = angular.module('controllers.timeline',[
    'ionic.utils'
]);

paradropCtrl.controller('timelineCtrl',
    function($scope,$ionicModal, $state, $localStorage, $ionicLoading) {

        if ($localStorage.get('firstLogin')) {
            $localStorage.set('firstLogin', false);
        }

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
        

        $ionicLoading.show({
            template: 'Loading...'
        });


        //Get Activity List from Parse, group by activity Category

        $scope.categoryList = [];
        $scope.allActivityList = [];
        $scope.todoList = []; //for the todo list screen

        var query = new Parse.Query('Activity');
        console.log('parse request: get activity list');
        
        query.find({
            
            success: function(activities) {

                var activityList = [];

                for (var i = 0; i < activities.length; i++) {

                    var activity = {
                        activityName: activities[i].get('title'), 
                        activityCategory: activities[i].get('category'),
                        points: activities[i].get('points'),
                        pointCategory: activities[i].get('pointCategory'),
                        description: activities[i].get('description')
                    };
                      
                    activityList.push(activity);
                }

                $scope.allActivityList = activityList;

                console.log($scope.allActivityList);
                generateCategoryList(activityList);
                $scope.todoList = generateToDoList();

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
                            category.activities.push({name: activity.activityName, points: activity.points, pointCategory: activity.pointCategory, description: activity.description});
                            console.log("Update category: " + activity.activityCategory + ", activity: " + activity.activityName);
                            break;
                        }
                    }

                } else {
                    console.log("Add category: " + activity.activityCategory + ", activity: " + activity.activityName);
                    $scope.categoryList.push({title: activity.activityCategory, activities: [{name: activity.activityName, points: activity.points, pointCategory: activity.pointCategory, description: activity.description}]});
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


        $scope.saveSelections = function() {

            $ionicLoading.show({
                template: 'Loading...'
            });

            var user = Parse.User.current();

            var todoList = user.get('todoList');

            for (var i = 0; i < $scope.pendingActivities.length; i++) {
                
                //add activities to user profile. save to parse
                if (!listContainsActivity(todoList, $scope.pendingActivities[i].name)) {

                    console.log('add ' + $scope.pendingActivities[i]);
                    todoList.push($scope.pendingActivities[i]);

                }
            }

            console.log("parse request: save todo list");

            user.set('todoList', todoList);

            user.save().then(function(obj) {
              // the object was saved successfully.
              $scope.todoList = generateToDoList();

              $scope.$apply();

              $ionicLoading.hide();
                $scope.modal.hide();
            }, function(error) {
              // the save failed.
              $ionicLoading.hide();
                $ionicPopup.alert({
                  title: "Couldn't Establish Connection.",
                  okText: 'OK'
                });
                $state.go('logout');
            });

            // ({
            //   success: function(user) {
            //     $ionicLoading.hide();
            //     $scope.modal.hide();
            //   },
            //   error: function(error) {
            //     $ionicLoading.hide();
            //     $ionicPopup.alert({
            //       title: "Couldn't Establish Connection.",
            //       okText: 'OK'
            //     });
            //     $state.go('logout');
            //   }
            // });

        }


        var listContainsActivity = function(list, activity) {

            for (var i = 0; i < list.length; i++) {
                
                if (list[i].name == activity) {
                    return true;
                }

            }

            return false;

        }


        $scope.pendingActivities = [];

        $scope.addActivity = function(categoryName, activityName) {

            if (listContainsActivity($scope.pendingActivities, activityName)){
                //do not allow duplicates

                console.log('duplicate so it stays ' + $scope.pendingActivities);
                return;
            }

            var frequency;

            for (var i = 0; i < $scope.categoryList.length; i++) {
                if ($scope.categoryList[i].title == categoryName) {
                    
                    for (var j = 0; j < $scope.categoryList[i].activities.length; j++) {
                        if ($scope.categoryList[i].activities[j].name == activityName) {
                            frequency = $scope.categoryList[i].activities[j].frequency;
                        }
                    }

                }
            }

            if (frequency == null) {
                frequency = "Just Once";
            }

            $scope.pendingActivities.push( {name: activityName, freq: frequency } );
            console.log($scope.pendingActivities);

        }


        function generateToDoList() {

            var user = Parse.User.current();

            var userTodoList = user.get('todoList');

            console.log(userTodoList);

            var todoList = [];
            var activities = $scope.allActivityList;

            for (var i = 0; i < userTodoList.length; i++){
                for (var j = 0; j < activities.length; j++) {

                    if (userTodoList[i].name == activities[j].activityName) {

                        var thisAct = activities[j];
                        thisAct.frequency = userTodoList[i].freq;
                        todoList.push(thisAct);

                    }

                }
            }

            return todoList;

        }



    });