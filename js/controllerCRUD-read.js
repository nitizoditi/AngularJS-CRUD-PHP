
var app = angular.module("CRUD-read", []);

var ctrlRead = app.controller('CRUD-read-controller', function($scope, $rootScope, $http, $element, $attrs, $log) {
	// type = crud type[create/read/update/delete]
	//$scope.table.type = $attrs.type;
	
	// table = tableName
	//$scope.table.name = $attrs.table;
	
	$scope.GetCRUDActionType($element, $attrs);
	
	/*
	 *	control the default template, hidden can hide the
	 *		columns, label will show 'display name' as form control's label
	 *	
	 *	label = {columnName:'display name'}
	 *	hidden = {'fieldName', 'field'}
	*/
	$scope.label = {};
	$scope.hidden = [];

	$scope.view = 'G';
	
	$scope.formData = $scope.read;

	// 20150609, keithpoon, fixed: ng filter require a array
	$scope.displayData = [];
	$scope.displayError = {};

	// pagination
	$scope.count = -1;
	$scope.selectedRecord = {};
	$scope.pointedRecord = {};

	$scope.isSelectedRecord = false;
	$scope.isPointedRecord = false;

	$scope.step = 10;
	$scope.stepOption = [
		{numOfStep:5},
		{numOfStep:10},
		{numOfStep:25},
		{numOfStep:50}
	];

	$scope.pageSize = 5; // now unused, max to show how many page button
	$scope.currentPageNum = -1;
	$scope.maxPageNum = 10;
	
	// table sortable function
	$scope.sort = {}
	$scope.sort.predicate = '';
	$scope.sort.reverse = false;
	
	$scope.showCol = {};
	
	$scope.readStatus = {}
	$scope.readStatus.disableRefresh = false;
	
	$scope.FirstReadFinished = false;
		
	// get table structure for gen table tree node
	if(typeof($rootScope.table[$scope.table.name]) == "undefined"){
		$scope.GetTableSchema($scope.table.type);
	}
	
	/*
	 *	When the same get table schema request are sent and wait for the response,
	 *	the next same name of table schema request will not sent, now will watch and
	 *	wait for the response.
	 */
	$rootScope.$watch(
		function($rootScope){
			return $rootScope.tableSource[$scope.table.name];
		}, function(newVal, oldVal){
		if(typeof(newVal) != "undefined" ){
			if(typeof(newVal)=="string"){
				if(newVal != null && newVal!=""){
					$scope.ConvertSchema2Fields(newVal)
				}
			}else{
				$scope.ConvertSchema2Fields(newVal)
			}
		}
	})

	
	$scope.DisableRefreshButton = function(){
		$scope.readStatus.disableRefresh = true;
		$scope.readStatus.refreshingData = true;
	}
	
	$scope.EnableRefreshButton = function(){
		$scope.readStatus.disableRefresh = false;
		$scope.readStatus.refreshingData = false;
	}
		
	// get Database records
	$scope.RefreshData = function(haha){
		$scope.PointToPage(1);
		/*
		var tempAction = $rootScope.controller+"public-selectProduct.php";
		$scope.DisableRefreshButton();
		console.log("123: "+$scope.count);

		console.log($scope.action)

		if($scope.action)
			tempAction = $rootScope.controller+$scope.action;
		$http(
			{
				method	:	"POST",
				url		:	tempAction,
				params	:	{"table":$scope.table.name, 'crud-type':$scope.table.type},//, "create":$scope.formData},
				responseType	:	'json'
			}).
			success(function(data, status, headers, config) {
				$scope.displayData = data.data;
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
			}).
			error(function(data, status, headers, config) {
				$scope.displayError = data;
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
			});

			*/
	}
	
	$rootScope.$watch(
		function(){return $rootScope.getSchemaStatus[$scope.table.name]},
		function(newValue, oldValue){
			if ( newValue !== oldValue )
			if($rootScope.getSchemaStatus[$scope.table.name]=="ok"){
				$scope.RefreshData();
			}else{
				console.warn("Read Controller: ");
				console.warn("Obtain table structure 'fail', cancel to read data from table "+$scope.table.name);
			}
		}
	);

	// pageNum: one based
	$scope.PointToPage = function(pageNum){
		console.log("try to select page:"+pageNum);

		//$scope.FindMaxPageNum();
		var isPointAtStart = false;
		var isPointAtEnd = false;
		var maxPageNum = $scope.maxPageNum;

		$scope.currentPageRecords = [];
			$scope.displayData = [];
			
		if(maxPageNum<=0){
			$scope.isPointAtStart = isPointAtStart;
			$scope.isPointAtEnd = isPointAtEnd;
			return;
		}
		//var totalDataRows = $scope.dataSource.length;

		var step = $scope.step;
		var rowStart = step*(pageNum-1);
		var rowEnd = step*pageNum;

		/*
		for(i=rowStart; i<rowEnd; i++){
			//$scope.displayData[$scope.displayData.length] = $scope.dataSource[rowStart];
			if(i>=totalDataRows)
				break;

			$scope.displayData[$scope.displayData.length] = $scope.dataSource[i];
		}
		*/

		var tempAction = $rootScope.controller+"public-selectProduct.php";
		$scope.DisableRefreshButton();


		if($scope.action)
			tempAction = $rootScope.controller+$scope.action;
		$http(
			{
				method	:	"POST",
				url		:	tempAction,
				params	:	{"table":$scope.table.name, 'crud-type':$scope.table.type, "page":pageNum},//, "create":$scope.formData},
				responseType	:	'json'
			}).
			success(function(data, status, headers, config) {
				$scope.displayData = data.data;
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
			}).
			error(function(data, status, headers, config) {
				$scope.displayError = data;
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
			});


		$scope.currentPageNum = pageNum;

		if($scope.currentPageNum==1)
			isPointAtStart = true;

		if($scope.currentPageNum == $scope.maxPageNum)
			isPointAtEnd = true;

		console.log("Page "+pageNum +" selected.");

		$scope.isPointAtStart = isPointAtStart;
		$scope.isPointAtEnd = isPointAtEnd;
	}

	$scope.PointToNextPage = function(){
		var curPageNum = $scope.currentPageNum;
		//var totalDataRows = $scope.dataSource.length;
		var maxPageNum = $scope.maxPageNum;

		if(curPageNum<maxPageNum)
			$scope.PointToPage(curPageNum + 1);
	}
	$scope.PointToPreviousPage = function(){
		var curPageNum = $scope.currentPageNum;
		if(curPageNum>1)
			$scope.PointToPage(curPageNum - 1);
	}

	$scope.PointToFirstPage = function(){
		$scope.PointToPage(1);
	}

	$scope.PointToLastPage = function(){
		$scope.PointToPage($scope.maxPageNum);
	}

	$scope.FindMaxPageNum = function(){
		var getTheRecordsCountTarget = $rootScope.controller+"public-selectProductCount.php";
			$http(
				{
					method	:	"POST",
					url		:	getTheRecordsCountTarget,
					params	:	{"table":$scope.table.name, 'crud-type':$scope.table.type},//, "create":$scope.formData},
					responseType	:	'json'
				}).
				success(function(data, status, headers, config) {
					$scope.count = data.data[0].count;

					var totalDataRows = $scope.count;
					var step = $scope.step;

					var maxPageNum = 0;
					if(totalDataRows!=0)
						if(totalDataRows%step==0)
							maxPageNum = totalDataRows/step;
						else
							maxPageNum = Math.floor(totalDataRows/step)+1;

					$scope.maxPageNum = maxPageNum;
					if(totalDataRows<=0)
						console.log("Read Ctrl: Data source length is 0")
				}).
				error(function(data, status, headers, config) {
					console.log("Get product records fail");
					console.dir(data);
				});
	}

	
	$scope.PointToRecord = function($event, pointedRecord){
		var $element = $($event.currentTarget);
		var $parent = $element.parent();

		$parent.children("tr").removeClass("info");

		$element.addClass("info")

		$scope.pointedRecord = pointedRecord;

		$scope.isPointedRecord = true;
		$scope.isSelectedRecord = false;
	}
	
	$scope.DoubleClickAndPointToRecord = function($event, pointedRecord){

		$scope.PointToRecord($event, pointedRecord);

		$scope.PointToRecordConfirm();
	}

	$scope.PointToRecordConfirm = function(){
		$scope.selectedRecord = $scope.pointedRecord;
		$scope.isPointedRecord = false;
		$scope.isSelectedRecord = true;
	}

	$scope.UnSelectedRecord = function(){
		$scope.isSelectedRecord = false;
		$log.log($scope.view)
	}
	
	$log.info("Controller<crud crud-read-controller> - executed.");

		// get the records length
		$scope.FindMaxPageNum();

	$scope.ReadTesting = function(text){
		console.log("Hello: "+text)
	}
});
