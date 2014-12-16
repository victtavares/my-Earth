var paradropCtrl = angular.module('controllers.profile',['services.activityModel']);

paradropCtrl.controller('profileCtrl',
	function($scope,$ionicModal,activityModel) {

		//bullshit data to initialize chart
		//activityModel.getLoggedUserToDoList();

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

		$scope.allTime = function() {


			//TODO: Get these values
		  var h2o = [322, 525, 646, 753];
		  var co2 = [453, 444, 364, 243];

		  var startMonth = 8;
		  var numNewDataPoints = h2o.length;
		  var thisMonth = startMonth;
		  var monthTitle = "";

		  for (var i = 0; i < h2o.length; i++) {

		    monthTitle = getMonthTitle(thisMonth);

		    myLineChart.addData([co2[i], h2o[i]], monthTitle);

		    if (thisMonth != 12) {
		      thisMonth++;
		    } else {
		      thisMonth = 1;
		    }

		  }

		  removeOldData(numNewDataPoints);

		  myLineChart.update();

		}

		$scope.thisWeek = function() {


			//TODO: Get these values
		  var h2o = {mon: 30, tue: 50, wed: 32, thur: 47, fri: null, sat: null, sund: null};
		  var co2 = {mon: 23, tue: 43, wed: 34, thur: 58, fri: null, sat: null, sund: null};

		  var numNewDataPoints = 0;

		  if (co2.mon != null) {
		    myLineChart.addData([co2.mon, h2o.mon], "Monday"); 
		    numNewDataPoints++;
		  }
		  if (co2.tue != null) {
		    myLineChart.addData([co2.tue, h2o.tue], "Tuesday");
		    numNewDataPoints++;
		  }
		  if (co2.wed != null) {
		    myLineChart.addData([co2.wed, h2o.wed], "Wednesday");
		    numNewDataPoints++;
		  }
		  if (co2.thur != null) {
		    myLineChart.addData([co2.thur, h2o.thur], "Thursday");
		    numNewDataPoints++;
		  }
		  if (co2.fri != null) {
		    myLineChart.addData([co2.fri, h2o.fri], "Friday");
		    numNewDataPoints++;
		  }
		  if (co2.sat != null) {
		    myLineChart.addData([co2.sat, h2o.sat], "Saturday");
		    numNewDataPoints++;
		  }
		  if (co2.sund != null) {
		    myLineChart.addData([co2.sund, h2o.sund], "Sunday");
		    numNewDataPoints++;
		  }

		  removeOldData(numNewDataPoints);

		  myLineChart.update();

		}

		var removeOldData = function(numNewDataPoints) {

		  var numPoints = myLineChart.datasets[0].points.length;

		  for (var i = 0; i < numPoints - numNewDataPoints; i++) {

		    myLineChart.removeData();

		  }

		}

		var getMonthTitle = function(thisMonth) {

		  switch(thisMonth) {
		    case 1: return "January";
		    case 2: return "February";
		    case 3: return "March";
		    case 4: return "April";
		    case 5: return "May";
		    case 6: return "June";
		    case 7: return "July";
		    case 8: return "August";
		    case 9: return "September";
		    case 10: return "October";
		    case 11: return "November";
		    case 12: return "December";
		  }

		}

		$scope.allTime();

});