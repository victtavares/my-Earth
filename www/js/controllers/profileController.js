var paradropCtrl = angular.module('controllers.profile',['services.activityModel']);

paradropCtrl.controller('profileCtrl',
	function($scope,$ionicModal,activityModel, activityDoneList) {

		//console.log(activityDoneList);



		//$ionicLoading.show({
		//	template: 'Loading...'
		//});
		//var promise = activityModel.getUserActivityDoneList();
		//promise.then(function(results) {
		//	console.log(results);
		//
		//
		//
		//
		//	$ionicLoading.hide();
		//}, function(error) {
		//	$ionicLoading.hide();
        //
		//});

		//bullshit data to initialize chart

		var overallPoundsCarbonSaved = 1500;
			//TODO: Create service for this.


		var treesPerPoundOfCarbon = 2.9;

		var galsOfWaterSaved = 345;
		 	//TODO: Create service for this.

		$scope.treesSaved = Math.round(overallPoundsCarbonSaved * treesPerPoundOfCarbon);
		$scope.waterSaved = Math.round(galsOfWaterSaved);

		var data = {
		  labels: ["air", "water", "wind", "fire"],
		  datasets: [
		    {
		      label: "Carbon Usage",
		      fillColor: "rgba(130,255,180,0.2)",
		      strokeColor: "rgba(130,255,180,1)",
		      pointColor: "rgba(130,255,180,1)",
		      pointStrokeColor: "#fff",
		      pointHighlightFill: "#fff",
		      pointHighlightStroke: "rgba(130,255,180,1)",
		      data: [32, 46, 37, 85]
		    },
		    {
		      label: "Water Usage",
		      fillColor: "rgba(151,187,255,0.2)",
		      strokeColor: "rgba(151,187,255,1)",
		      pointColor: "rgba(151,187,255,1)",
		      pointStrokeColor: "#fff",
		      pointHighlightFill: "#fff",
		      pointHighlightStroke: "rgba(151,187,255,1)",
		      data: [46, 86, 85, 36]
		    }
		  ]
		};

		var options = {

		    bezierCurve : false,
		    animation: false,
		    showTooltips: false

		};

	  	var ctx = document.getElementById("myChart").getContext("2d");
	  	var myLineChart = new Chart(ctx).Line(data, options);

	  	$scope.bestWeek = function() {

		    console.log('bestWeek');

		    //TODO: Get these values
		    var h2o = {mon: 32, tue: 56, wed: 63, thur: 80, fri: 24, sat: 33, sund: 42};
		    var co2 = {mon: 43, tue: 63, wed: 34, thur: 72, fri: 76, sat: 47, sund: 50};


		    myLineChart.addData([co2.mon, h2o.mon], "Monday"); 
		    myLineChart.addData([co2.tue, h2o.tue], "Tuesday");
		    myLineChart.addData([co2.wed, h2o.wed], "Wednesday");
		    myLineChart.addData([co2.thur, h2o.thur], "Thursday");
		    myLineChart.addData([co2.fri, h2o.fri], "Friday");
		    myLineChart.addData([co2.sat, h2o.sat], "Saturday");
		    myLineChart.addData([co2.sund, h2o.sund], "Sunday");

		    removeOldData(7);

		    myLineChart.update();

	  	}

	  	$scope.worstWeek = function() {


	  		//TODO: Get these values
		  var h2o = {mon: 23, tue: 43, wed: 34, thur: 52, fri: 16, sat: 37, sund: 24};
		  var co2 = {mon: 23, tue: 35, wed: 49, thur: 84, fri: 25, sat: 32, sund: 38};

		  myLineChart.addData([co2.mon, h2o.mon], "Monday"); 
		  myLineChart.addData([co2.tue, h2o.tue], "Tuesday");
		  myLineChart.addData([co2.wed, h2o.wed], "Wednesday");
		  myLineChart.addData([co2.thur, h2o.thur], "Thursday");
		  myLineChart.addData([co2.fri, h2o.fri], "Friday");
		  myLineChart.addData([co2.sat, h2o.sat], "Saturday");
		  myLineChart.addData([co2.sund, h2o.sund], "Sunday");

		  removeOldData(7);

		  myLineChart.update();

		}

		//------------------------ ALL TIME DATA -----------------------------------------


		// Join activity by month
		//var test = new Date(2015, 07, 20, 3, 45, 60, 30);
		//var test2 = new Date(2015, 06, 20, 3, 45, 60, 30);
		//var test2 = new Date(2015, 05, 20, 3, 45, 60, 30);
		//var test3 = new Date(2015, 04, 20, 3, 45, 60, 30);
		//var test4 = new Date(2015, 03, 20, 3, 45, 60, 30);
		//var test5 = new Date(2015, 02, 20, 3, 45, 60, 30);
		//activityDoneList[activityDoneList.length-1].createdAt = test;
		//activityDoneList[activityDoneList.length-2].createdAt = test2;
		//activityDoneList[activityDoneList.length-3].createdAt = test3;
		//activityDoneList[activityDoneList.length-4].createdAt = test4;
		//activityDoneList[activityDoneList.length-5].createdAt = test5;

		var getMonthTitle = function(thisMonth) {

			switch(thisMonth) {
				case 1: return "Jan";
				case 2: return "Feb";
				case 3: return "Mar";
				case 4: return "Apr";
				case 5: return "May";
				case 6: return "Jun";
				case 7: return "Jul";
				case 8: return "Aug";
				case 9: return "Sept";
				case 10: return "Oct";
				case 11: return "Nov";
				case 12: return "Dec";
			}

		}

		var joinActivityByMonth = function () {
			var pointsMonth = {};
			//Getting first month and year
			var month = activityDoneList[0].createdAt.getMonth();
			var year = activityDoneList[0].createdAt.getFullYear();
			//Getting first activity
			var monthYear = getMonthTitle(month+1) +"/" +year.toString();
			var activity = activityDoneList[0].get("activity");
			//adding points to the first activity according to the category, //category 0 = Pounds of carbon , category 1 = Water
			if (activity.get("pointCategory") == "Pounds of Carbon") {
				pointsMonth[monthYear] = [activity.get("points"),0];
			} else {
				pointsMonth[monthYear] = [0,activity.get("points")];
			}

			//going through all the activities, except the first one
			var pointsCategory;
			for (i = 1; i < activityDoneList.length; i++) {
				//if it still the same month and year, join the activity according to its category
				if (month == activityDoneList[i].createdAt.getMonth() && activityDoneList[i].createdAt.getYear()) {
					activity = activityDoneList[i].get("activity");

					//category 0 = Pounds of carbon , category 1 = Water
					pointsCategory = pointsMonth[monthYear];
					if (activity.get("pointCategory") == "Pounds of Carbon") {
						pointsCategory[0] = pointsCategory[0] + activity.get("points");
					} else {
						pointsCategory[1] = pointsCategory[1] + activity.get("points");
					}
				} else {
					month = activityDoneList[i].createdAt.getMonth();
					year = activityDoneList[i].createdAt.getFullYear();
					//New month and year
					monthYear = getMonthTitle(month+1) +" " +year.toString();

					//category 0 = Pounds of carbon , category 1 = Water
					//Initializing this new month
					if (activity.get("pointCategory") == "Pounds of Carbon") {
						pointsMonth[monthYear] = [activity.get("points"),0];
					} else {
						pointsMonth[monthYear] = [0,activity.get("points")];
					}
				}
			}
			return pointsMonth;
		}

		$scope.allTime = function() {
			//console.log(joinActivityByMonth());
			var activityByMonth = joinActivityByMonth();
			var numNewDataPoints = Object.keys(activityByMonth).length;//h2o.length;

			//if its just 1 month - add another one
			if (numNewDataPoints <= 1) {
				var month = activityDoneList[activityDoneList.length-1].createdAt.getMonth();
				var year = activityDoneList[activityDoneList.length-1].createdAt.getFullYear();
				if (month == 0) {
					month = 12;
					year = year -1;
				}
				var monthYear = getMonthTitle(month) +"/" +year.toString();
				myLineChart.addData([0,0], monthYear);
				numNewDataPoints++;
			}

			for (var monthYear in activityByMonth) {
				myLineChart.addData(activityByMonth[monthYear], monthYear);
			}
		  removeOldData(numNewDataPoints);

		  myLineChart.update();

		}

		// change the period of time text
		var month = activityDoneList[0].createdAt.getMonth() + 1;
		var firstDate = getMonthTitle(month) + "/" + activityDoneList[0].createdAt.getFullYear();
		month = activityDoneList[activityDoneList.length-1].createdAt.getMonth() +1;
		var lastDate = getMonthTitle(month)  + "/" + activityDoneList[activityDoneList.length-1].createdAt.getFullYear();
		$scope.startEndMonthAllTime = firstDate + " - " + lastDate;

		//------------------------ THIS WEEK DATA -----------------------------------------

		var getFirstDayWeek = function () {
			var d = new Date();
			var curr = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);// get current date
			var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
			firstday = new Date(curr.setDate(first));

			return firstday;

		}

		var getPointsThisWeek = function () {
			var d = new Date();
			var activity;
			var pointsWeek = {};
			var curr = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 59);// get current date
			var firstDay = getFirstDayWeek();
			var pointsCategory;
			var dayKey;

			//Initialize Day of the week
			for (i = 0; i <= curr.getDay(); i++) {
				pointsWeek[i] = [0,0];
			}


            //
			for (i = 0; i < activityDoneList.length; i++) {
			//	//  FirstDay < createdAt < CurrentTime
				if ((activityDoneList[i].createdAt.getTime() < curr.getTime()) && (activityDoneList[i].createdAt.getTime() > firstDay.getTime())) {
					activity = activityDoneList[i].get("activity");
					dayKey = activityDoneList[i].createdAt.getDay();
					pointsCategory = pointsWeek[dayKey];
					if (activity.get("pointCategory") == "Pounds of Carbon") {
						pointsCategory[0] = pointsCategory[0] + activity.get("points");
					} else {
						pointsCategory[1] = pointsCategory[1] + activity.get("points");
					}
				}
			}
			return pointsWeek;



		}

		var getDayTitle = function(thisDay) {
			switch(thisDay) {
				case "0":return "Sunday";
				case "1": return "Monday";
				case "2": return "Tuesday";
				case "3": return "Wednesday";
				case "4": return "Thursday";
				case "5": return "Friday";
				case "6": return "Saturday";
			}

		}

		$scope.thisWeek = function() {

			var pointsThisWeek = getPointsThisWeek();
			var numNewDataPoints = Object.keys(pointsThisWeek).length;//h2o.length;

			for (var weekDay in pointsThisWeek) {
				myLineChart.addData(pointsThisWeek[weekDay], getDayTitle(weekDay));
			}

		  removeOldData(numNewDataPoints);

		  myLineChart.update();

		}

		var firstDayWeek = getFirstDayWeek();
		firstDate = getMonthTitle(getFirstDayWeek().getMonth() + 1) + " " + firstDayWeek.getDate();
		d = new Date();
		lastDate = getMonthTitle(d.getMonth() +1) + " " + d.getDate();
		$scope.startEndThisWeek = firstDate + " - " + lastDate




		var removeOldData = function(numNewDataPoints) {

		  var numPoints = myLineChart.datasets[0].points.length;

		  for (var i = 0; i < numPoints - numNewDataPoints; i++) {

		    myLineChart.removeData();

		  }

		}








		$scope.allTime();

});