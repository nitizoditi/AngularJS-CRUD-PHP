var app = angular.module("myApp", ['ngAnimate', 'ngRoute', "CRUD-create", "CRUD-read", "CRUD-update", "CRUD-delete", "ngFileUpload", "CRUD-listwin"], function($httpProvider, $provide, $injector) {
	//$locationProvider.html5Mode(true);

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8;";
	$httpProvider.interceptors.push(['$q', function($q) {
	    return {
	        request: function(config) {
	            if (config.data && typeof config.data === 'object') {
	                // Check https://gist.github.com/brunoscopelliti/7492579 
	                // for a possible way to implement the serialize function.
	                config.data = serialize(config.data);
	            }
	            return config || $q.when(config);
	        }
	    };
	}]);
	var serialize = function(obj, prefix) {
	// http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
	var str = [];
	for(var p in obj) {
		var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
		str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
  	}
	return str.join("&");
	}
	//['$rootScope', '$scope', '$location',
  //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";

  // overwirte $log
  /*
  $provide.decorator('$log', function($delegate, $sniffer, $injector) {
    var _log = $delegate.log;
		
    $delegate.log = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.info = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.warn = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.error = function(msg){
	  //if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.debug = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
		return $delegate;
	});
*/
});

app.run( function($rootScope, $log) {
	$rootScope.table = {};
	$rootScope.tableSource = {};
	$rootScope.getSchemaStatus = {};
	var host = window.location.hostname;
	var href = window.location.href;
	href = href.toLowerCase();
	if(href.indexOf("acms.acgni.net") >= 0)
		//$rootScope.webRoot = protocol+"//"+host+"/";
		$rootScope.webRoot = "/";
	else if(href.indexOf("localhost/sponline") >= 0)
		$rootScope.webRoot = "/sponline/";
	else if(href.indexOf("localhost") >= 0)
		$rootScope.webRoot = "//localhost/";
	else
		$rootScope.webRoot = "//acms.acgni.net/";
	
	$rootScope.controller = $rootScope.webRoot+"controller/";
	$rootScope.webTemplates = $rootScope.webRoot+"Templates/crud/";
	
	$rootScope.isDebug = true;

	$rootScope.systemAccessStatus = {};
	$rootScope.systemAccessStatus.sys_begin = "Begin";
	$rootScope.systemAccessStatus.sys_submitting = "Submitting";
	$rootScope.systemAccessStatus.sys_success = "Success";
	$rootScope.systemAccessStatus.sys_fail = "Fail";
	
	$rootScope.systemAccessStatus.sys_created = "Created";
	$rootScope.systemAccessStatus.sys_selected = "Selected";
	$rootScope.systemAccessStatus.sys_updated = "Updated";
	$rootScope.systemAccessStatus.sys_deleted = "Deleted";

	$rootScope.systemAccessStatus.sys_recordDuplicated = "RecordDuplicated";
	$rootScope.systemAccessStatus.sys_recordNotFound = "RecordNotFound";
	$rootScope.systemAccessStatus.sys_constraintDenyDelete = "ConstraintDenyDelete";
	$rootScope.systemAccessStatus.sys_lastUpdateChanged = "LastUpdateChanged";

	$rootScope.systemAccessStatus.sys_connectionError = "ConnectionError";
	$rootScope.systemAccessStatus.sys_sqlError = "sqlError";
	$rootScope.systemAccessStatus.sys_jsonError = "JSONError";
	$rootScope.systemAccessStatus.sys_timeout = "Timeout";

	$rootScope.reservedFields = {};
	$rootScope.reservedFields.createUser = "createUser";
	$rootScope.reservedFields.createDate = "createDate";
	$rootScope.reservedFields.lastUpdateUser = "lastUpdateUser";
	$rootScope.reservedFields.lastUpdateDate = "lastUpdateDate";
	$rootScope.reservedFields.systemUpdateDate = "systemUpdateDate";
	$rootScope.reservedFields.systemUpdateUser = "systemUpdateUser";
	$rootScope.reservedFields.systemUpdateProgram = "systemUpdateProgram";

});

var CRUDContainerObj = app.controller('CRUD-container', function($route, $location, $scope, $rootScope, $http, $element, $attrs, $log, $timeout) {
	$scope.screenMessage = {};
	$scope.error = [];
	$scope.table = {};
	$scope.action = "";
	$scope.form = {};
	$scope.form.name = "";

	$scope.systemAccessStatus = angular.copy($rootScope.systemAccessStatus);
	$scope.reservedFields = angular.copy($rootScope.reservedFields);
	
	$scope.dataSchema = {}; // format = describe table

	// format similar as $scope.dataSchema
	// table structure in array for template use to repeat the form control
	/*
	 * format = {
	 *   "fieldName": {
	 *    "type": "int",
	 *    "length": "10",
	 *    "decimalPoint": "2",
	 *    "null": 1,
	 *    "default": null
	 *	}, ...
	 * }
	 */
	$scope.fields = {}; 
	// for clear the files preview
	$scope.files = [];
	$scope.files[0] = {};
	$scope.files[0].lastModified = 0;
	$scope.files[0].lastModifiedDate = new Date();
	$scope.files[0].name = "";
	$scope.files[0].progress = "";
	$scope.files[0].result = {};
	$scope.files[0].size = 0;
	$scope.files[0].type = "";
	$scope.files[0].upload = {};
	$scope.files[0].webkitRelativePath = "";
	
	$scope.create = {};
	$scope.createDate = {};
	$scope.createDefaultValue = {};
	$scope.submitStatus = {};
	
	$scope.updateFrom = {};
	$scope.updateTo = {};
	$scope.updateStatus = {};

	// store the date object of form control
	$scope.tempDate = {};
	$scope.tempDate.dateObject = {};
	$scope.tempDate.showResultString = {};

	// delete is a reserved word in javascript =[
	//$scope.deleteData = {};	
	
	$scope.test = function(){
		console.dir($scope.create)
	}

	$scope.DebugLog = function(message, status){
		if($rootScope.isDebug){
			switch(status){
				case "log":
					$log.log(message);
					break;
				case "warn":
					$log.warn(message);
					break;
				case "debug":
					$log.debug(message);
					break;
				case "info":
					$log.info(message);
					break;
				default:
					$log.log(message);
			}
		}
	}

	$scope.RemoveReservedFields = function(scopeObject){
		$log.log($scope.reservedFields)
		angular.forEach( $scope.reservedFields, function( columnName, indexName  ) {
                var removeIndex = scopeObject.indexOf(columnName);
                scopeObject.splice(removeIndex,1);
            });
		return scopeObject;
	}

	$scope.Submit = function(relatedData){
		$scope.ResetSubmitStatus();
		$scope.SubmitStart();
		var crud_type = $scope.table.type;
		
		$scope.formData = {};
		switch(crud_type){
			case "create":
				$scope.formData = angular.copy($scope.create);
				break;
			case "read":
				break;
			case "update":
				$scope.formData.from = angular.copy($scope.updateFrom);
				$scope.formData.to = angular.copy($scope.updateTo);
				break;
			case "delete":
				$log.log("parnet check deleteConfirmation: "+$scope.submitStatus.deleteConfirmation)
				if(!$scope.submitStatus.deleteConfirmation)
					return;
				$scope.formData = relatedData;
				$log.log(relatedData);
				break;
		}
		
		// find all the date/datetime/timestamp/time create form control, get the date object and set as string for send to server
		var breakThisLoop = [];
		breakThisLoop[0] = false;
		breakThisLoop[1] = false;
		// loop create form controls
		if(crud_type!="delete")
		angular.forEach( $scope.formData, function( formControlValue, formControlName  ) {
		  if(!breakThisLoop[0]){
			var modelTypeOf = typeof(formControlValue);
			// loop the data schema
			angular.forEach( $rootScope.table[$scope.table.name], function( schemaDetails, tableSchemaIndex ) {
			  if(!breakThisLoop[1]){
				if(schemaDetails.Field == formControlName){
				  $scope.DebugLog("is date/time field checking. control: "+formControlName, +", type:"+schemaDetails.Type+", value:"+formControlValue, "warn");
				  if(modelTypeOf=="object"){
				  	if(formControlValue !=null){
							var year = formControlValue.getFullYear();
							var month = formControlValue.getMonth()+1;
							var day = formControlValue.getDate();
							month = month.toString().length > 1 ? month :"0"+month;
							day = day.toString().length > 1 ? day :"0"+day;
							
							var hours = formControlValue.getHours();
							var minutes = formControlValue.getMinutes();
							var seconds = formControlValue.getSeconds();
							
							hours = hours.toString().length > 1 ? hours :"0"+hours;
							minutes = minutes.toString().length > 1 ? minutes :"0"+minutes;
							seconds = seconds.toString().length > 1 ? seconds :"0"+seconds;
						switch(schemaDetails.Type) {
							case "date":
								$scope.createDate[formControlName] = year+"-"+month+"-"+day;
								break;
							case "datetime":
							case "timestamp":
								$scope.createDate[formControlName] = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
								break;
							case "time":
								break;
						}
					}
				  }else{
				  	$scope.DebugLog("typeof is not a object, not need convert date to string", "info");
				  }
			    }
			  }
		    });
		  }
		});
		// End - find all the date/datetime/timestamp/time object 
		
		var sendData = {};
		// process the form submission
		switch(crud_type){
			case "create":
				sendData = {"table":$scope.table.name, 'crud-type':crud_type, "create":$scope.formData, "createDate":$scope.createDate};
				//$log.log(sendData.create);
				break;
			case "read":
				break;
			case "update":
				//var ajaxResult = $http.post($scope.action, {"table":$scope.table.name, 'crud-type':crud_type, "updateFrom":$scope.formData.from, "updateTo":$scope.formData.to})
				sendData = {"table":$scope.table.name, 'crud-type':crud_type, "updateFrom":$scope.formData.from, "updateTo":$scope.formData.to};
				break;
			case "delete":
				sendData = {"table":$scope.table.name, 'crud-type':crud_type, "delete":$scope.formData};
				break;
		}

		try{
			$scope.submitStatus.submitting = true;
				$scope.submitStatus.status = $scope.systemAccessStatus.sys_submitting;
				$log.log(sendData);
			var ajaxResult = $http.post($scope.action, sendData);
		}catch(err){
			$scope.UnlockFormContorl();
			//$scope.submitStatus.statusDesc = "ConnectionError";
			$scope.submitStatus.status = $scope.systemAccessStatus.sys_connectionError;
			$scope.submitStatus.phpError = err;
			$scope.UpdateSubmitStatus(false);
		}
		ajaxResult.success(function(data, status, headers, config, statusText){
			var tempIsSuccess = false;
			try{
				//$scope.submitStatus.statusDesc = "Fail";
				$scope.submitStatus.status = $scope.systemAccessStatus.sys_fail;
				switch(crud_type){
					case "create":
						var affected_rows = parseInt(data.affected_rows);
						if(affected_rows > 0){
							//$scope.submitStatus.statusDesc = "Created";
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_created;
							for(key in $scope.formData){
								$scope.submitStatus.keyValue[0] = $scope.formData[key];
								break;
							}
							tempIsSuccess = true;
						}
						break;
					case "update":
						$log.debug(data)
						var affected_rows = parseInt(data.affected_rows);
						$log.debug("update result, affected_rows: "+affected_rows);
						if(affected_rows>0){
							//$scope.submitStatus.statusDesc = "Updated";
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_updated;
							$("#"+$scope.table.name+"-refresh-data").trigger('click');
							tempIsSuccess = true;
						}else{
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_lastUpdateChanged;
						}
						break;
					case "delete":
						$log.debug(data)
						var affected_rows = parseInt(data.affected_rows);
						$log.debug("delete result, affected_rows: "+affected_rows)
						if(affected_rows>0){
							//$scope.submitStatus.statusDesc = "Deleted";
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_deleted;
							$("#"+$scope.table.name+"-refresh-data").trigger('click');
							tempIsSuccess = true;
						}
						break;
				}
			}catch(err){
				$scope.submitStatus.status = "JSONError";
				$scope.submitStatus.phpError = err;
			}
				$scope.UpdateSubmitStatus(tempIsSuccess);
				// it must use $timeout instead of setTimeOut(function(){...})

				if(tempIsSuccess){
					$timeout(function(){
						$scope.AfterSubmitOK();
						$scope.ResetSubmitStatus();
						$scope.UnlockFormContorl();
					}, 4000);
				}else{
					$timeout(function(){
						$scope.AfterSubmitFail();
						$scope.ResetSubmitStatus();
				$scope.UnlockFormContorl();
					}, 4000);
				}

		});
		ajaxResult.error(function(data, status, headers, config, statusText){
			console.log("Submit fail, please the following details");
			console.dir(data)
			console.dir(status)
			console.dir(headers)
			console.dir(config)
			console.dir(statusText)
			$scope.UnlockFormContorl();
			//$scope.submitStatus.statusDesc = "ConnectionError";
			$scope.submitStatus.status = $scope.systemAccessStatus.sys_connectionError;
			$scope.submitStatus.phpError = data;
			$scope.UpdateSubmitStatus(false);
		});


	} // Submit - End
	$scope.UnlockFormContorl = function(){
		$scope.submitStatus.lockControl = false;
	}
	$scope.LockFormContorl = function(){
		$scope.submitStatus.lockControl = true;
	}

	$scope.SubmitStart = function(){
		$scope.submitStatus.lockControl = true;
		$scope.submitStatus.keyValue = {};
		$scope.submitStatus.status = $scope.systemAccessStatus.sys_begin;
	}
	

		$scope.ResetSubmitStatus = function(){
			$scope.submitStatus.lockControl = false;			
			$scope.submitStatus.status = $scope.systemAccessStatus.sys_begin;

			// submit [success | fail]
			$scope.submitStatus.isSuccess = false;
			$scope.submitStatus.isFail = false;

			$scope.submitStatus.isSubmitSuccess = false;
			$scope.submitStatus.isSuccess = false;

			// submit break down to
			// create / update / delete - [success | fail]
			$scope.submitStatus.isCreateSuccess = false;
			$scope.submitStatus.isCreateFail = false;
			$scope.submitStatus.isSelectSuccess = false;
			$scope.submitStatus.isSelectFail = false;
			$scope.submitStatus.isUpdateSuccess = false;
			$scope.submitStatus.isUpdateFail = false;
			$scope.submitStatus.isDeleteSuccess = false;
			$scope.submitStatus.isDeleteFail = false;

			$scope.submitStatus.isRecordDuplicated = false;		// create
			$scope.submitStatus.isRecordNotFound = false;		// select
			$scope.submitStatus.isLastUpdateChanged = false;		// update
			$scope.submitStatus.isConstraintDenyDelete = false; // delete

			$scope.submitStatus.isResponseSQLError = false;
			$scope.submitStatus.isResponseJsonError = false;
			$scope.submitStatus.isTimeout = false;
			$scope.submitStatus.isConnectionError = false;

			// ajax call error
			$scope.submitStatus.isConnectionError = false;
		}



		$scope.RefreshData = function(){
			for(i=0; i<$("."+$scope.table.name+"-refresh-data").length; i++)
				$($("."+$scope.table.name+"-refresh-data")[i]).trigger('click');
		}

		$scope.AfterSubmitFail = function(){
		}
		$scope.AfterSubmitOK = function(){
			var crud_type = $scope.table.type;
			
			// clear upload files
			
			//if($scope.files.length > 0)
			//console.dir(typeof($scope.files))
			//console.dir($scope.files)
			//$scope.files = [];
			switch(crud_type){
				case "create":
					if($scope.submitStatus.isCreateSuccess){
						$scope.ClearCreateForm();
						$scope.ResetCreateFormDefaultValue();
					}
					$scope.RefreshData();
					break;
				case "update":
					$("#"+$scope.table.name+"-back-to-table").trigger('click');
					//$("#"+$scope.table.name+"-refresh-data").trigger('click');
					//$scope.updateFrom = angular.copy($scope.updateTo);
					$scope.RefreshData();
					break;
				case "delete":
					//$("#"+$scope.table.name+"-refresh-data").trigger('click');
					$scope.RefreshData();
					break;
			}
		}
		$scope.UpdateSubmitStatus = function(tempIsActionSuccess){
			var currentStatusBool = tempIsActionSuccess;
			var currentStatusString = $scope.submitStatus.status;

			$log.log(currentStatusString);

			var crud_type = $scope.table.type;
			var systemStatus = angular.copy($rootScope.systemAccessStatus);

			if(currentStatusBool){
				$scope.submitStatus.isSuccess = true;
			}else{
				$scope.submitStatus.isFail = true;

					switch(crud_type){
						case "create":
							$scope.submitStatus.isCreateFail = true;
							break;
						case "update":
							$scope.submitStatus.isUpdateFail = true;
							break;
						case "delete":
							$scope.submitStatus.isDeleteFail = true;
							break;
					}
			}

			switch(currentStatusString){
				case systemStatus.sys_created: // created
					$scope.submitStatus.isCreateSuccess = true;
					break;
				case systemStatus.sys_selected: // selected
					$scope.submitStatus.isSelectSuccess = true;
					break;
				case systemStatus.sys_updated: // updated
					$scope.submitStatus.isUpdateSuccess = true;
					break;
				case systemStatus.sys_deleted: // deleted
					$scope.submitStatus.isDeleteSuccess = true;
					break;

				case systemStatus.sys_recordDuplicated:
					$scope.submitStatus.isRecordDuplicated = true;
					break;
				case systemStatus.sys_recordNotFound:
					$scope.submitStatus.isRecordNotFound = true;
					break;
				case systemStatus.sys_constraintDenyDelete:
					$scope.submitStatus.isConstraintDenyDelete = true;
					break;
				case systemStatus.sys_lastUpdateChanged:
					$scope.submitStatus.isLastUpdateChanged = true;
					break;
				case systemStatus.sys_sqlError:
					$scope.submitStatus.isResponseSQLError = true;
					break;
				case systemStatus.sys_jsonError:
					$scope.submitStatus.isResponseJsonError = true;
					break;
				case systemStatus.sys_timeout:
					$scope.submitStatus.isTimeout = true;
					break;
				case systemStatus.connectionError:
					$scope.submitStatus.isConnectionError = true;
					break;
			}
			$scope.submitStatus.isSubmitSuccess = $scope.submitStatus.isSuccess;
		}

	$scope.ClearCreateForm = function(){
		angular.forEach( $scope.create, function(value, index){
			$scope.create[index] = null;
		});
		angular.forEach($scope.tempDate['dateObject'], function(fieldObject, index){
			$scope.tempDate['dateObject'][index] = null;
		})
	}
	$scope.ResetCreateFormDefaultValue = function(){
		$scope.create = angular.copy($scope.createDefaultValue);
	}

	function ConvertSchema2Fields(jsonData){
		$scope.ConvertSchema2Fields(jsonData);
	}

	$scope.ConvertSchema2Fields = function(jsonData){
		var data = jsonData;
		var crudType = $scope.table.type;
				$rootScope.table[$scope.table.name] = data.data;
				$rootScope.tableSource[$scope.table.name] = data;
				$scope.dataSchema = data.data;
				//$log.log(JSON.stringify(data.data))
				if(crudType=="create" || crudType=="update")
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
	
	$scope.GetTableSchema = function(crudType){
		
		var isGetting = typeof $rootScope.getSchemaStatus[$scope.table.name];
		if(isGetting != "undefined")
			return;
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

	$scope.GetCRUDActionType = function(element, attrs){
		$scope.table.name = attrs.table;
	  	var controllerName = attrs.controller;
	  	var crudActionType = "";

	  	switch(controllerName){
	  		case "CRUD-create-controller":
	  			crudActionType = "create";
	  			break;
	  		case "CRUD-read-controller":
				crudActionType = "read";
	  			break;
	  		case "CRUD-update-controller":
				crudActionType = "update";
	  			break;
	  		case "CRUD-delete-controller":
				crudActionType = "delete";
	  			break;
	  		case "listWin-controller":
				crudActionType = "listwin";
	  			break;
	  		default:
	  			throw "Have not define CRUD type in <crud> tag, please specify [create | read | update | delete]"
	  			break;
	  	}
		$scope.table.type = crudActionType;
		$scope.sourceHTML = element.html();
	}

	$scope.ResetSubmitStatus();
	
	$log.info("Controller<div crud-container> - executed.");
});


// define the <crud> tag
app.directive('crud', function($rootScope, $log) {
    return {
      restrict: 'E',
      scope: true, // set true for shared parent scope, set scope:{}, isolate scope
      controller: "@",
	  name: "controller",
	  templateUrl: function(elem, attrs){
	  	//scope.sourceHTML = $(elem).html();

	  	var tempCrudTableName = attrs.table
	  	var controllerName = attrs.controller;
	  	var crudActionType = "";

	  	switch(controllerName){
	  		case "CRUD-create-controller":
	  			crudActionType = "create";
	  			break;
	  		case "CRUD-read-controller":
				crudActionType = "read";
	  			break;
	  		case "CRUD-update-controller":
				crudActionType = "update";
	  			break;
	  		case "CRUD-delete-controller":
				crudActionType = "delete";
	  			break;
	  		case "listWin-controller":
				crudActionType = "listwin";
	  			break;
	  	}
		
	  	var tempCrudActionType = attrs.type;

	  	//var crudActionType = tempCrudActionType;
        //
		//if(typeof(attrs.create) != "undefined"){
		//	crudActionType = "create";
		//}else if(typeof(attrs.read) != "undefined"){
		//	crudActionType = "read";
		//}else if(typeof(attrs.update) != "undefined"){
		//	crudActionType = "update";
		//}else if(typeof(attrs.delete) != "undefined"){
		//	crudActionType = "delete";
		//}

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

		$log.info("Directive<crud> | templateUrl() - template URL generated: " + targetPath);
		  return targetPath;
	  },
	  /*
	  link: function(scope, elem, attrs){
		//console.log("Directive<crud>| link");
		console.log(scope.sourceHTML)
		//console.log($(elem).html()+scope.sourceHTML)
		//$(elem).html($(elem).html()+scope.sourceHTML);
		$log.info("Directive<crud> | link()");
		//$log.log(elem.html())
	  }
	  */
	  link: {
		  pre: function preLink(scope, iElement, iAttrs, controller) {

		//console.log(scope.sourceHTML)
		  	//$log.log($(iElement).html($(iElement).html()+scope.sourceHTML))
		  },
		  post: function postLink(scope, iElement, iAttrs, controller) {
		  	//$log.log(iElement.html())

		  	$log.info("Directive<crud> | link()");
		  }
		}
	};
})
  
// define the integer attribute for input control
var INTEGER_REGEXP = /^\-?\d+$/;
app.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});

app.directive('trySrcCatch', function($http, $log) {
  return {
     restrict: "A",
	  compile: function compile(tElement, tAttrs, transclude) {
		return {
		  pre: function preLink(scope, element, attrs, controller){
		  	scope.$watch("trySrcCatch", function(){
		  		console.log("changed to "+attrs.trySrcCatch)
		  	})
		  	var basePath = attrs.tryBasePath;
		  	var imgName = attrs.trySrcCatch;
		  	var imgFullPath = basePath+imgName;

			if(imgName != null && imgName != ""){
		  	$http.get(imgFullPath).then(function(response){
			    // this callback will be called asynchronously
			    // when the response is available
			    console.dir(response);
			    attrs.$set('src', imgFullPath);
		  		element.show();
		  	}, function(response){
		  		// called asynchronously if an error occurs
		  		// or server returns response with an error status.
			    console.dir(response);
		  		element.hide();
		  	});
		    }else{
		  		element.hide();
		    }
		  },
		  post: function postLink(scope, element, attrs, controller){

		  }
		}
	  }
  }
});

// Updating textarea value with CKEditor content in Angular JS
// http://stackoverflow.com/questions/18917262/updating-textarea-value-with-ckeditor-content-in-angular-js
app.directive('ckEditor', function($log) {
  return {
		restrict: 'E',
    require: '?ngModel',
    scope: {
    	ckConfig: '=',
    	filebrowserUploadUrl: '=',
    	filebrowserBrowseUrl: '@'
    },
    link: function(scope, elm, attr, ngModel) {
    	$log.log("new ckEditor")
    	if (!ngModel) return;

    	var config = {};

    	config = scope.ckConfig;

    	$log.log("config")
    	console.dir(attr)
    	$log.log(scope)
    	$log.log(scope['ckConfig'])

    	var ck;

    	//elm.bind('click', function(){
                //for(name in CKEDITOR.instances)
                    //CKEDITOR.instances[name].destroy();
                ck = CKEDITOR.replace(elm[0], scope.ckConfig);
        //});

    	

	    ck.on('instanceReady', function() {
	      ck.setData(ngModel.$viewValue);
	    });

	    function updateModel() {
	        scope.$apply(function() {
	            ngModel.$setViewValue(ck.getData());
	        });
	    }

	    ck.on('change', updateModel);
	    ck.on('key', updateModel);
	    ck.on('dataReady', updateModel);

	    ngModel.$render = function(value) {
	      ck.setData(ngModel.$viewValue);
	    };
    }
  };
});

app.directive('ckEditorConfig', function($log) {
	return {
		require: '?ckEditor',
		restrict: 'A',
		link: function(scope, elm, attr, ngModel) {
    	$log.log(attr.ckEditorConfig);
		}
	}
});

// http://stackoverflow.com/questions/18157305/angularjs-compiling-dynamic-html-strings-from-database
app.directive('dynamicHtml', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamicHtml, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});

app.filter('forLoop', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

/*
var INTEGER_REGEXP = /^\d{4}$/;
app.directive('year', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});

var INTEGER_REGEXP = /^(0?[1-9]|1[012])$/;
app.directive('month', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});
*/