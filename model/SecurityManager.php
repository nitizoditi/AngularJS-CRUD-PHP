<?php
//require_once 'DatabaseManager.php';

class SecurityManager extends DatabaseManager {

	/* 
		SecurityManager
		handle the user login and login action, remember me session algorithm.

		WebuserManager
		handle the registration, forgot and reset password and user management.
	*/
    protected $_ = array(
    );
    
    protected $hash;
	
	protected $table = "webuser";
	protected $tempLoginID = "";
	protected $tempPassword = "";
	//private $security_status = array();
	//private $access_status = array();
    
    function __construct() {
    	if (session_status() == PHP_SESSION_NONE) {
		    session_start();
		}
		parent::__construct();
		/*
		$this->security_status = array(
			// registration
			"UserNameDuplicate" => "The username already in used by someone.",

			// Authorization || login
			"AuthorizationFail" => "Not enough permission to perform operation.", // permissions (what you are allowed to do)

			// Permission
			"NoPermission" => "Not enough permission to perform operation.",
			"AuthenticationFail" => "Invalid login ID or password."
		);
		*/
		$this->hash = array(
    		"sha1" => "sha1", // 40 length
    		"sha256" => "sha256", // 64 length
    		"sha384" => "sha384", // 96 length
    		"sha512" => "sha512", // 128 length
    		"password_hash" => "password_hash"
    	);
    	/*
		$this->access_status = array(
			"OK" => "OK",
			"Duplicate" => "Duplicate",
			"Fail" => "Fail",
			"Error" => "Error",
			"TopOfFile" => "TopOfFile",
			"EndOfFile" => "EndOfFile",
			"Locked" => "Locked",
			"RecordNotFound" => "RecordNotFound",
			"SqlError" => "SqlExecuteError",
			"NoPermission" => "NoPermission",
			"AuthorizationFail" => "AuthorizationFail", // permissions (what you are allowed to do)
			"AuthenticationFail" => "AuthenticationFail"
			
		);
		*/

		$this->Initialize();
    }
	function Initialize(){
		//$this->debug = true;

		parent::getDataSchemaForSet(false);
		parent::setArrayIndex();

		$this->isSelectAllColumns = false;
		$this->selectWhichCols = "w.userID, loginID, status, isDisabled, activateDate, w.permissionID, p.permissionGroupName, lastName, firstName, fullName, nickName, gender";

		$this->ResetResponseArray();
	}
	function ReInit(){
		$this->Initialize();
	}
	function SetDefaultValue(){
		parent::setDefaultValue();
	}

	function Hash($phrase, $hashType = "sha1"){
		if(array_key_exists($hashType, $this->hash)){
			return hash($hashType, $phrase);
		}else{
			if($hashType == $this->hash["password_hash"])
				return password_hash($phrase, PASSWORD_DEFAULT);
			return false;
		}
	}

	function SetDBContector($dbc){
		parent::SetDBContector($dbc);
	}


	/**
	 * DatabaseManager insert/select/update/delete action before checking
	 *
	 * basic checking:
	 * if the user have not logged in - only select is avaiable
	 * if the user logged in - insert/select/update/delete are avaiable.
	 */
	function CRUD_PermissionCheck($crudType){
		if($this->topRightToken)
			return $this->topRightToken;
		$crudType = ($crudType == 'updateAnyFieldTo') ? 'update' : $crudType;
		$isLoggedIn = $this->isUserLoggedInBool();
		$returnValue = false;

		//if($this->enableSecurityModule)
		//$returnValue = true;

		if($this->enableSecurityModule && !$this->enableAdvanceSecurityCheck){

			// if($isLoggedIn)
			// 	$returnValue = true;

			$returnValue = $isLoggedIn;

			$returnValue = $crudType == "select" || $crudType == "read";
			/*
			switch ($crudType) {
				case 'insert':
				case 'update':
				case 'delete':
					//$this->GetRe["error"] = $this->access_status["AuthorizationFail"];
					break;
				default:
					$returnValue = true;
					break;
			}
			*/

		}else if($this->enableSecurityModule && $this->enableAdvanceSecurityCheck){
			if($isLoggedIn){
				// check the webuser PermissionID, PermissionGroup, PermissionRight table
				$selectGlobalRightCols = "`permissionGroupName` as 'permsGrpName', `globalCreateRight` as 'insert', `globalReadRight` as 'select', `globalUpdateRight` as 'update', `globalDeleteRight` as 'delete'";
				$selectIndividualRightCols = "`createRight` as 'insert', `readRight` as 'select', `updateRight` as 'update', `deleteRight` as 'delete'";
				$permsGroupName = "N/A";
				$tempCR = false;
				$tempRR = false;
				$tempUR = false;
				$tempDR = false;

				// get permissionID
				$permsID = $_SESSION['USER_PermissionID'];

				// check the global CRUD right
					$sql_str = sprintf("SELECT $selectGlobalRightCols FROM `permission` WHERE permissionID = %s",
							$permsID);
				//$responseArray = $this->queryForDataArray($sql_str);
				$this->sql_str = $sql_str;
				$responseArray = $this->queryForDataArray();
				if($responseArray['num_rows']>0){
					$permsGroupName = $responseArray['data'][0]['permsGrpName'];
					$tempCR = $responseArray['data'][0]['insert'] == 'A';
					$tempRR = $responseArray['data'][0]['select'] == 'A';
					$tempUR = $responseArray['data'][0]['update'] == 'A';
					$tempDR = $responseArray['data'][0]['delete'] == 'A';
				}


				// check the break down right
				$tempFunctionName = "N/A";
				$tempCtrlName = $this->permsCtrlName;
					$sql_str = sprintf("SELECT $selectIndividualRightCols FROM `permissionGroupRight` WHERE (permissionID = %s or permissionGroupName = '%s') AND (functionName = '%s' or controllerName = '%s')",
							$permsID,
							$permsGroupName,
							$tempFunctionName,
							$tempCtrlName);


				$this->sql_str = $sql_str;
				$responseArray = $this->queryForDataArray();

				if($responseArray['num_rows']>0){
					$tempCR = $responseArray['data'][0]['insert'] == 'A';
					$tempRR = $responseArray['data'][0]['select'] == 'A';
					$tempUR = $responseArray['data'][0]['update'] == 'A';
					$tempDR = $responseArray['data'][0]['delete'] == 'A';
				}

				switch ($crudType) {
					case 'insert':
						$returnValue = $tempCR;
						break;
					case 'select':
						$returnValue = $tempRR;
						break;
					case 'update':
						$returnValue = $tempUR;
						break;
					case 'delete':
						$returnValue = $tempDR;
						break;
					default:
						$returnValue = false;
						break;
				}
			}

		}
		return $returnValue;
	}

	function Registration(){
		return $this->insert();
	}
	
	function doLogin($username, $password){
		//$this->tempLoginID = $this->GetRealEscapeString($username);//mysql_real_escape_string($username);
		//$this->tempPassword = $this->GetRealEscapeString($password);//mysql_real_escape_string($password);

		$this->tempLoginID = $this->GetRealEscapeString($username);
		$this->tempPassword = $this->GetRealEscapeString($password);

		if($this->IsNullOrEmptyString($this->tempLoginID) || $this->IsNullOrEmptyString($this->tempPassword))
		{
			return $this->isUserLoggedIn();
		}else{
			$this->loginID = $this->tempLoginID;
			$this->password = $this->Hash($this->tempPassword);

			return $this->select();
		}
	}

	// Overwriting the select function in DatabaseManager
	function select(){
		$array = $this->_;
		$dataSchema = $this->dataSchema;
		$tempSelectWhichCols = "*";
		if(!$this->isSelectAllColumns)
			$tempSelectWhichCols = $this->selectWhichCols;
		
		$whereSQL = "";
		$isWhere = false;
		foreach ($array as $index => $value) {
			// if TableManager->value =null, ignore
			if(isset($value)){
				if(isset($this->SearchDataType($dataSchema['data'], 'Field', $index)[0]['Default']))
					if ($value == $this->SearchDataType($dataSchema['data'], 'Field', $index)[0]['Default'])
						continue;
				$whereSQL .= "`".$index."` = ". $value . " and ";
				$isWhere = true;
			}
		}
		if($isWhere){
			$whereSQL = rtrim($whereSQL, " and "); //would cut trailing 'and'.
			$sql_str = sprintf("SELECT $tempSelectWhichCols from %s where %s",
					$this->table." w, member m, permission p",
					$whereSQL." and m.userID = w.userID and w.permissionID = p.permissionID");
		}

			$this->sql_str = $sql_str;
			$responseArray = $this->queryForDataArray();

		//$responseArray = $this->responseArray;
		if($responseArray["num_rows"]==1){
			$this->rememberLoginUserInSession($responseArray["data"][0]);
		}else{
			$responseArray["access_status"] = $this->access_status["AuthenticationFail"];
			//array_push($this->responseArray_errs, sprintf($this->sys_err_msg["AuthenticationFail"]));
			if(!$this->IsNullOrEmptyString($responseArray["error"]))
			 	$responseArray["error"] .= "\n\r".$this->sys_err_msg["AuthenticationFail"];
			 else
			 	$responseArray["error"] = $this->sys_err_msg["AuthenticationFail"];

		}
		return $responseArray;

	}

	// Overwriting the insert function in DatabaseManager
	function DBManager_CheckPermission($crudType){
		return true;
	}

	function rememberLoginUserInSession($dataRow){
		foreach ($dataRow as $key => $value) {
			$_SESSION['USER_'.$key] = $value;

			setcookie($key, $value, time() + (86400 * 30), "/"); // 86400 = 1 day
		}
				setcookie('isLogin', 1, time() + (86400 * 30), "/"); // 86400 = 1 day
		/*
		$_SESSION['USER_ID'] = $dataRow["userID"];
		$_SESSION['LOGIN_ID'] = $dataRow["loginID"];
		$_SESSION['USER_Status'] = $dataRow["status"];
		$_SESSION['USER_IsDisabled'] = $dataRow["isDisabled"];
		$_SESSION['USER_PermissionID'] = $dataRow["permissionID"];
		$_SESSION['USER_PermissionGroupName'] = $dataRow["permissionGroupName"];
		$_SESSION['USER_LastName'] = $dataRow["lastName"];
		$_SESSION['USER_FirstName'] = $dataRow["firstName"];
		$_SESSION['USER_FullName'] = $dataRow["fullName"];
		$_SESSION['USER_NickName'] = $dataRow["nickName"];
		$_SESSION['USER_Gender'] = $dataRow["gender"];
		*/
        $_SESSION['USER_login_status'] = 1;
	}

	function isUserLoggedIn(){
		/*
		$responseArray = array("isLogin" => 0);
		if(isset($_SESSION['USER_login_status']) && $_SESSION['USER_login_status'] == 1)
		{
			$responseArray['isLogin'] = 1;
		}
		*/
		$responseArray = $this->ResetResponseArray();

		$responseArray['num_rows'] = 0;
		$responseArray['isLogin'] = 0;
		if(isset($_SESSION['USER_login_status']) && $_SESSION['USER_login_status'] == 1)
		{
			$responseArray['num_rows'] = 1;
			$responseArray['affected_rows'] = 1;
			$responseArray['isLogin'] = 1;

			foreach ($_SESSION as $key => $value) {
				# code...
				$cookieKeyName = substr($key,strrpos($key,'_')+1);

				$responseArray['data'][0][$cookieKeyName] = $value;

				setcookie($cookieKeyName, $value, time() + (86400 * 30), "/"); // 86400 = 1 day
			}
				setcookie('isLogin', 1, time() + (86400 * 30), "/"); // 86400 = 1 day


			//$responseArray['data'][0]['userID'] = $_SESSION['USER_ID'];
			//$_SESSION['LOGIN_ID'] = $dataRow["loginID"];

			//$responseArray['data'][0]['lastName'] = $_SESSION['USER_LastName'];
			//$responseArray['data'][0]['firstName'] = $_SESSION['USER_FirstName'];
			//$responseArray['data'][0]['fullName'] = $_SESSION['USER_FullName'];
			//$responseArray['data'][0]['nickName'] = $_SESSION['USER_NickName'];
			//$responseArray['data'][0]['gender'] = $_SESSION['USER_Gender'];

				setcookie('isLogin', 1, time() + (86400 * 30), "/"); // 86400 = 1 day
		}else{

				setcookie('isLogin', 0, time() + (86400 * 30), "/"); // 86400 = 1 day
		}

		return $responseArray;
	}

	function isUserLoggedInBool(){
		if(isset($_SESSION['USER_login_status']) && $_SESSION['USER_login_status'] == 1)
		{
			return true;
		}
		return false;
	}

	function doLogout(){
        // delete the session of the user
        //$responseArray = array("isLogin" => 0);
        $responseArray = $this->ResetResponseArray();
        try{

			foreach ($_SESSION as $key => $value) {
				# code...
				$cookieKeyName = substr($key,strrpos($key,'_')+1);

				//$responseArray['data'][0][$cookieKeyName] = $value;

				unset($_COOKIE[$cookieKeyName]);
			}

        	$_SESSION = array();
        	session_destroy();
        	$responseArray['isLogin'] = 0;
				setcookie('isLogin', 0, time() + (86400 * 30), "/"); // 86400 = 1 day
        	
    	}catch(Exception $e) {
    		$responseArray["error"] = $e;
    	}
    	return $responseArray;

	}
    
    function __isset($name){
        return isset($this->_[$name]);
    }
}
?>
