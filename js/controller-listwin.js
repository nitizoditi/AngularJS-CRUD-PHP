var app = angular.module("CRUD-listwin", []);

var ctrlListWin = app.controller('listWin-controller', function($scope, $rootScope, $http, $element, $attrs, $log) {
	// type = crud type[create/read/update/delete]	
	// table = tableName	
	$attrs.controller = $attrs.ngController;
	//$scope.GetCRUDActionType($attrs);
	//$scope.table.type = "listwin";
	
	
	$scope.dataSource = [];
	$scope.displayData = {};
	$scope.displayError = {};

	// pagination
	$scope.selectedRecord = {};
	$scope.pointedRecord = {};

	$scope.isSelectedRecord = false;
	$scope.isPointedRecord = false;
	
	$scope.step = 10;
	$scope.pageSize = 5; // now unused, max to show how many page button
	$scope.currentPageNum = -1;
	$scope.maxPageNum = -1;

	$scope.isPointAtStart = false;
	$scope.isPointAtEnd = false;
	
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
		console.log("Table: "+$scope.table.name+", go to get listwin schema.")
		$scope.GetTableSchema($scope.table.type);
	}
	else{
		ConvertSchema2Fields($rootScope.tableSource[$scope.table.name]);
	}
	
	$scope.test = function(){
		console.dir($scope)
	}
	
	//*
	 //*	When the same get table schema request are sent and wait for the response,
	 //*	the next same name of table schema request will not sent, now will watch and
	 //*	wait for the response.
	 //*
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
		$scope.DisableRefreshButton();
		$http(
			{
				method	:	"POST",
				url		:	$rootScope.controller+"simple-selectTableRecord.php",
				params	:	{"table":$scope.table.name, 'crud-type':$scope.table.type},//, "create":$scope.formData},
				responseType	:	'json'
			}).
			success(function(data, status, headers, config) {
				//$scope.displayData = data.data;
				$scope.dataSource = data.data;
				
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
				$scope.PointToPage(1);
			}).
			error(function(data, status, headers, config) {
				$scope.displayError = data;
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
			});
	}

	// pageNum: one based
	$scope.PointToPage = function(pageNum){
		$scope.FindMaxPageNum();
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
		var totalDataRows = $scope.dataSource.length;

		var step = $scope.step;
		var rowStart = step*(pageNum-1);
		var rowEnd = step*pageNum;

		for(i=rowStart; i<rowEnd; i++){
			//$scope.displayData[$scope.displayData.length] = $scope.dataSource[rowStart];
			if(i>=totalDataRows)
				break;

			$scope.displayData[$scope.displayData.length] = $scope.dataSource[i];
		}
		$scope.currentPageNum = pageNum;

		if($scope.currentPageNum==1)
			isPointAtStart = true;

		if($scope.currentPageNum == $scope.maxPageNum)
			isPointAtEnd = true;

		$scope.isPointAtStart = isPointAtStart;
		$scope.isPointAtEnd = isPointAtEnd;
	}

	$scope.PointToNextPage = function(){
		var curPageNum = $scope.currentPageNum;
		var totalDataRows = $scope.dataSource.length;
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
		var totalDataRows = $scope.dataSource.length;
		var step = $scope.step;

		var maxPageNum = 0;
		if(totalDataRows!=0)
			if(totalDataRows%step==0)
				maxPageNum = totalDataRows/step;
			else
				maxPageNum = Math.floor(totalDataRows/step)+1;

		$scope.maxPageNum = maxPageNum;
	}
	
	$scope.PointToRecord = function($event, pointedRecord){
		var $element = $($event.currentTarget);
		var $parent = $element.parent();

		$parent.children("tr").removeClass("info");

		$element.addClass("info")

		$scope.pointedRecord = pointedRecord;
	}
	
	$scope.DoubleClickAndPointToRecord = function($event, pointedRecord){

		$scope.PointToRecord($event, pointedRecord);

		$scope.PointToRecordConfirm();
	}

	$scope.PointToRecordConfirm = function(){
		$scope.selectedRecord = $scope.pointedRecord;
	}
	
	$rootScope.$watch(
		function(){return $rootScope.getSchemaStatus[$scope.table.name]},
		function(newValue, oldValue){
			if ( newValue !== oldValue )
			if($rootScope.getSchemaStatus[$scope.table.name]=="ok"){
				$scope.RefreshData();
			}else{
				console.warn("ListWin Controller: ");
				console.warn("Obtain table structure 'fail', cancel to read data from table "+$scope.table.name);
			}
		}
	);
	
	$scope.GetTableSchema = function(crudType){
		console.log("list win get table schema, table: "+$scope.table.name)
		$rootScope.getSchemaStatus[$scope.table.name] = "init";
		$http(
			{
				method:"POST",
				url:$rootScope.controller+"simple-selectTableStructure.php",
				params:{table:$scope.table.name},
				responseType:'json'
			}).
			success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				try{
					var tempCheck = data;
					console.log("response.access_status: "+tempCheck.access_status);
					ConvertSchema2Fields(data);
					$rootScope.getSchemaStatus[$scope.table.name] = "ok";
				}catch(err){
					$rootScope.getSchemaStatus[$scope.table.name] = "fail";
					console.log("error caused: "+err);
					console.log("status: "+status);
					console.log("headers: "+headers);
					console.log("config: "); console.dir(config);
					console.log("response data: "+data);
				}
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				//$scope.data = "fail";
				$rootScope.getSchemaStatus[$scope.table.name] = "fail";
			});
	}

	$scope.ConvertSchema2Fields = function(jsonData){
		var data = jsonData;
		var crudType = $scope.table.type;
				$rootScope.table[$scope.table.name] = data.data;
				$rootScope.tableSource[$scope.table.name] = data;
				$scope.dataSchema = data.data;
				//$log.log(JSON.stringify(data.data))
				if(crudType=="listwin")
				for(i=0; i<data.data.length; i++){
					var field = data.data[i];
					// assign the field name
					$scope.fields[field.Field] = {};
					// assign the field data type
					var columnType = field.Type;
					if(columnType.indexOf("(") == -1){
						$scope.fields[field.Field]["type"] = field.Type;
					}else{
						$scope.fields[field.Field]["type"] = field.Type.substr(0, field.Type.indexOf("("))
					}
					// assign the field length
					var pureType = $scope.fields[field.Field]["type"];
					$scope.fields[field.Field]["length"] = null;

					// only the char and varchar data type must specify a length
					// javascript integer limit +- 9007199254740992
					// http://stackoverflow.com/questions/307179/what-is-javascripts-highest-integer-value-that-a-number-can-go-to-without-losin
					if(columnType.indexOf("(") >-1){
						switch(pureType){
							case "tinyint":
								// A very small integer. The signed range is -128 to 127. The unsigned range is 0 to 255.
								break;
							case "smallint":
								// A small integer. The signed range is -32768 to 32767. The unsigned range is 0 to 65535.
								break;
							case "mediumint":
								// A medium-sized integer. The signed range is -8388608 to 8388607. The unsigned range is 0 to 16777215.
								break;
							case "int":
							case "integer": // This type is a synonym for INT.
								// A normal-size integer. The signed range is -2147483648 to 2147483647. The unsigned range is 0 to 4294967295.
								break;
						}
						switch(pureType){
							case "decimal":
								// assign the 
								$scope.fields[field.Field]["length"] = field.Type.substring(field.Type.indexOf('(')+1, field.Type.indexOf(',') );
								if(columnType.indexOf(",") >-1)
								{
									$scope.fields[field.Field]["decimalPoint"] = field.Type.substring(field.Type.indexOf(',')+1, field.Type.indexOf(')') );	
								}
								break;
							default:
								$scope.fields[field.Field]["length"] = field.Type.substring(field.Type.indexOf('(')+1, field.Type.indexOf(')') );
						}
					}else{
						switch(pureType){
							// numeric data type
							case "int":
								break;
							case "double":
								break;
							case "decimal":
								break;
							case "float":
								break;
							// date and time data type, must assign new Date() object if using HTML5 something like input[date]
							case "date":
							case "datetime":
							case "timestamp":
							case "time":
								//$scope.create[field.Field] = new Date();
								break;
							// string type
							case "char":
								break;
							case "varchar":
								break;
							case "tinytext":
								$scope.fields[field.Field]["length"] = 255;
								break;
							case "text":
							case "blob":
								$scope.fields[field.Field]["length"] = 65536;
								break;
							case "mediumtext":
							//MEDIUMBLOB, MEDIUMTEXT   L + 3 bytes, where L < 2^24   (16 Megabytes)
								$scope.fields[field.Field]["length"] = 65536;
								break;
							case "longtext":
							//LONGBLOB, LONGTEXT       L + 4 bytes, where L < 2^32   (4 Gigabytes)
								$scope.fields[field.Field]["length"] = 65536;
								break;
						}
					}
					
					// assign the key type
					// may be no need
					// assign is nullable
					$scope.fields[field.Field]["null"] = 0;
					if(field.Null == "NO")
						$scope.fields[field.Field]["null"] = 1;
					// assign the default value
					$scope.fields[field.Field]["default"] = field.Default;
				}
	}
	$log.info("Controller<crud listWin-controller> - executed.");
});

ctrlListWin.directive('listwin', function($rootScope, $compile, $log) {
//app.directive('listwin', function($rootScope, $compile, $log) {
    return {
      restrict: 'E',
      scope: true, // set true for shared parent scope, set scope:{}, isolate scope
	  /*
	  scope: {
		  table : '=',
		  type : '=',
		  definition : '=',
		  dataSchema : '=',
		  fields : '=',
		  displayData : '=',
		  
		  test : '&',
		  
		  dataSource : '=',
		  displayError : '=',
		  selectedRecord : '=',
		  pointedRecord : '=',
		  step : '=',
		  pageSize : '=',
		  currentPageNum : '=',
		  maxPageNum : '=',
		  isPointAtStart : '=',
		  isPointAtEnd : '=',
		  sort : '=',
		  showCol : '=',
		  readStatus : '=',
		  FirstReadFinished : '=',
		  },
		  */
	  templateUrl: function(elem, attrs){
	  	//console.dir(elem);

	  	var tempCrudTableName = attrs.table
	  	var controllerName = attrs.controller;
	  	var crudActionType = "listwin";


		var defaultPath = $rootScope.webTemplates;
		var customPath = $rootScope.webTemplates+"crud/crud-"+crudActionType+"-"+tempCrudTableName+".html";
		var targetPath = "";
		var folderName = "";
		var templateName = "crud-"+crudActionType+".html";
		//
		//	defaultPath = [default/custom]
		//		default = root/Templates/crud/crud-type.html
		//		custom 	= root/Templates/crud/custom/crud-type-table.html
		//
		if(!attrs.customTemplate){
			switch(attrs.templateType){
				case "html5": // view in batch
					folderName = "html5/";
					templateName = "crud-HTML5-"+crudActionType+".html";
					break;
				case "individual": // create / read / update / delete in individual record
					folderName = "individual/";
					break;
				case "auto": // create / read / update / delete mode are auto detect
					folderName = "auto_mode/";
					break;
				case "custom":
					folderName = "custom/";
					templateName = "crud-"+crudActionType+"-"+tempCrudTableName+".html";
					break;
				default: // HTML template as default
					folderName = "html5/";
					templateName = "crud-HTML5-"+crudActionType+".html";
					break;
			}
			targetPath = defaultPath + folderName + templateName;
			if(typeof(attrs.templatePath) != "undefined"){
				if(attrs.templatePath != null && attrs.templatePath != "")
					targetPath = attrs.templatePath;
			}
		}else{
			folderName = "tailor-make/";
			targetPath = defaultPath + folderName + attrs.customTemplate;
		}

		$log.info("Directive<listwin> | templateUrl() - template URL generated: " + targetPath);
		  return targetPath;
	  },
	  
	  compile: function compile(tElement, tAttrs, transclude) {
		return {
		  pre: function preLink(scope, element, attrs, controller){
			  console.log("Pre complie list win")
		  },
		  post: function postLink(scope, element, attrs, controller){
			  console.log("Post complie list win")
				var step = attrs.step;
				var pageSize = attrs.pageSize;
				var currentPageNum = attrs.currentPageNum;
		
				if(isNormalInteger(step))
					scope.$parent.step = parseInt(step);
				if(isNormalInteger(pageSize))
					scope.$parent.pageSize = parseInt(pageSize);
				if(isNormalInteger(currentPageNum))
					scope.$parent.currentPageNum = parseInt(currentPageNum);
		
		
				$log.info("Directive<listwin> | link()");
				//console.dir(scope.$parent);
		
				function isNormalInteger(str) {
					return /^\+?(0|[1-9]\d*)$/.test(str);
				}
		  }
		}
	  }
	};
})