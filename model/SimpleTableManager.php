<?php
require_once 'DatabaseManager.php';
//require_once 'SecurityManager.php';

class SimpleTableManager extends DatabaseManager {
    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "";
	//protected $securityManager;
    
    function __construct() {
		parent::__construct();
		//$this->securityManager = new SecurityManager();
    }
	function Initialize($tableName=""){
		$this->table = $tableName;
		$this->debug = true;
		
		// set parent dataSchema
		parent::getDataSchemaForSet();
		// set construct _ index
		parent::setArrayIndex();
	}
	
	function get(){
		return $this->table;
	}
	
	function set($tableName){
		$this->table = $tableName;
	}
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }
}
?>
