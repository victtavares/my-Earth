var paradropCtrl = angular.module('controllers.timeline',[
    'ionic.utils',
    'services.activityModel'
]);

paradropCtrl.controller('timelineCtrl',
    function($scope,$ionicModal, $state, $localStorage, $ionicLoading, $ionicPopup, activityModel) {



        //basics

        $scope.activityAddedPhrase = "Added!";
        $scope.activityNotAddedPhrase = "Add Activity";





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

                $ionicPopup.alert({
                    title: 'Connection Failed',
                    template: "<p>Please Try Again.</p>",
                    okText: 'OK'
                });

            }
        
        });


        //generates $scope.categoryList from list of activities
        function generateCategoryList(activList) {

            console.log("generateCategoryList");

            for (var i = 0; i < activList.length; i++) {

                var activity = activList[i];

                if (isInCategoryList(activity.activityCategory)) {
                    
                    for (var j = 0; j < $scope.categoryList.length; j++) {
                        category = $scope.categoryList[j];
                        if (category.title === activity.activityCategory) {

                            var pointCategoryIcon = "leaf";
                            var colorClass = "green-color";

                            if (activity.pointCategory == "Gallons of Water"){
                                pointCategoryIcon = "waterdrop";
                                colorClass = "blue-color";
                            }

                            category.activities.push({name: activity.activityName, points: activity.points, pointCategory: activity.pointCategory, description: activity.description, added: false, addedPhrase: "Add Activity", icon: pointCategoryIcon, colorClass: colorClass});
                            console.log("Update category: " + activity.activityCategory + ", activity: " + activity.activityName);
                            break;
                        }
                    }

                } else {

                    var pointCategoryIcon = "leaf";
                    var colorClass = "green-color";

                    if (activity.pointCategory == "Gallons of Water"){
                        pointCategoryIcon = "waterdrop";
                        colorClass = "blue-color";
                    }

                    console.log("Add category: " + activity.activityCategory + ", activity: " + activity.activityName);
                    $scope.categoryList.push({title: activity.activityCategory, activities: [{name: activity.activityName, points: activity.points, pointCategory: activity.pointCategory, description: activity.description, added: false, addedPhrase: "Add Activity", icon: pointCategoryIcon, colorClass: colorClass}]});
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

            console.log("saveSelections");

            $ionicLoading.show({
                template: 'Loading...'
            });

            var user = Parse.User.current();
            var todoList = user.get('todoList');
            var itemAdded = false;

            for (var i = 0; i < $scope.pendingActivities.length; i++) {
                
                //add activities to user profile. save to parse
                if (!listContainsActivity(todoList, $scope.pendingActivities[i].name)) {

                    itemAdded = true;
                    console.log('add ' + $scope.pendingActivities[i]);
                    todoList.push($scope.pendingActivities[i]);

                } else {

                    for (var j = 0; j < todoList.length; j++) {
                
                        console.log(todoList);
                        console.log($scope.pendingActivities);

                        if (todoList[j].name == $scope.pendingActivities[i].name) {
                            // if (todoList[j].freq != $scope.pendingActivities[i].freq){
                                todoList[j] = $scope.pendingActivities[i];
                                itemAdded = true;
                            // }
                        }

                    }

                }
            }

            console.log("parse request: save todo list");

            if(!itemAdded) {
                console.log('no new item added to todoList');
                $ionicLoading.hide();
                $scope.modal.hide();
                return;
            }

            console.log('todoList: ');
            console.log(todoList);
            user.set('todoList', todoList);

            user.save().then(function(obj) {
                // the object was saved successfully.
                $scope.todoList = generateToDoList();
                console.log("generate to do List:" + generateToDoList());
                $ionicLoading.hide();
                $scope.modal.hide();
                $state.go($state.current, {}, {reload: true});
            }, function(error) {
              // the save failed.
              $ionicLoading.hide();
                $ionicPopup.alert({
                  title: "Couldn't Establish Connection.",
                  okText: 'OK'
                });
            });

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

            console.log("addActivity " + activityName + " to " + categoryName);

            if (listContainsActivity($scope.pendingActivities, activityName)){
                //do not allow duplicates

                console.log('duplicate so it stays ' + $scope.pendingActivities);
                return;
            }

            // var frequency;

            for (var i = 0; i < $scope.categoryList.length; i++) {
                if ($scope.categoryList[i].title == categoryName) {
                    
                    for (var j = 0; j < $scope.categoryList[i].activities.length; j++) {

                        var act = $scope.categoryList[i].activities[j];

                        if (act.added)
                            {act.addedPhrase = 'Added!'} 
                        else {act.addedPhrase='Add Activity'};

                        if (act.name == activityName && act.added) {
                            // frequency = $scope.categoryList[i].activities[j].frequency;
                        }
                    }

                }
            }

            // if (frequency == null) {
            //     frequency = "Just Once";
            // }

            $scope.pendingActivities.push( {name: activityName} );
            console.log($scope.pendingActivities);

        }

        $scope.deleteActivity = function(activityName) {

            console.log("deleteActivity " + activityName);

            $ionicLoading.show({
                template: 'Loading...'
            });


            var user = Parse.User.current();
            var userTodoList = user.get('todoList');

            console.log(userTodoList);

            var todoList = [];
            var activities = $scope.allActivityList;

            for (var i = 0; i < userTodoList.length; i++){
                if (userTodoList[i].name == activityName) {

                    userTodoList.splice(i, 1);

                }
            }


            console.log("parse request: save new todo list");

            console.log('todoList: ');
            console.log(userTodoList);
            user.set('todoList', userTodoList);

            user.save().then(function(obj) {
                // the object was saved successfully.
                $scope.todoList = generateToDoList();
                console.log("generate to do List:" + generateToDoList());
                $ionicLoading.hide();
                $scope.modal.hide();
                $state.go($state.current, {}, {reload: true});
            }, function(error) {
              // the save failed.
              $ionicLoading.hide();
                $ionicPopup.alert({
                  title: "Couldn't Establish Connection.",
                  okText: 'OK'
                });
            });



        }


        function generateToDoList() {

            console.log("generateToDoList");

            var user = Parse.User.current();
            var userTodoList = user.get('todoList');

            console.log(userTodoList);

            var todoList = [];
            var activities = $scope.allActivityList;

            for (var i = 0; i < userTodoList.length; i++){
                for (var j = 0; j < activities.length; j++) {

                    if (userTodoList[i].name == activities[j].activityName) {

                        var thisAct = activities[j];
                        thisAct.added = true;
                        thisAct.addedPhrase = 'Added!';
                        // thisAct.frequency = userTodoList[i].freq;
                        todoList.push(thisAct);

                    }

                }
            }

            if (todoList.length == 0) {

                console.log('no items in todoList');
                document.getElementById('textIfNoItems').style.display = 'block';

            }

            return todoList;

        }


        //$scope.alertPoints = function(points, category) {
        //
        //    $ionicPopup.alert({
        //            title: 'Good Work!',
        //            template: points + ' ' + category + ' saved',
        //            okText: 'OK'
        //        });
        //
        //}


        //Do activity
        //TODO: change from name to the real activity
        $scope.doActivity  = function (activityName, category) {
            $ionicLoading.show({
                template: 'Loading...'
            });

            console.log("---- Do activity ------")
            // Getting the activity from Parse
            var promise = activityModel.getUniqueActivityByName(activityName);

            //If we get the activity with the activity Name
            promise.then(function (activity) {
                //Do that activity
                console.log(activity);
                var promise2 = activityModel.doActivity(activity);
                promise2.then(function (message) {
                    console.log(activity);
                    $ionicPopup.alert({
                        title: 'Good Work!',
                        template: activity.get("points") + ' ' + category + ' saved',
                        okText: 'OK'
                    });
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicPopup.alert({
                        title: error,
                        okText: 'OK'
                    });
                    $ionicLoading.hide();
                });

            }, function (message) {
                console.log("Error Message: " + message);
            })

        }



    });