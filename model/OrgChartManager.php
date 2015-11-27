<?php
require_once 'DatabaseManager.php';

class OrgChartManager extends DatabaseManager {
	protected $_orgChart;
	public $_idColumn;
	public $_supervisorColumn;


    protected $_ = array(
		// this Array structure By Initialize()
        // 'columnName1' => value,
        // 'columnName2' => value,
    );
	
	protected $table = "staff";
    
    function __construct() {
		parent::__construct();
        $this->Initialize();
        $this->_orgChart = new OrgChart();
    }
	function Initialize(){
		// set parent dataSchema
		parent::getDataSchemaForSet();
		// set construct _ index
		parent::setArrayIndex();
	}
	function SetDefaultValue(){
		parent::setDefaultValue();
	}
    
    function __isset($name) {
        return isset($this->_[$name]);
    }

    function select(){
    	$this->isSelectAllColumns = false;
    	$this->selectWhichCols = "staffID, fullName, position, imagePath, nickName, gender, supervisor";
    	return parent::select();
    }

    function ConvertData2OrgChartSchema($dataSet=null){
		$tempOrgChart = new OrgChart();
		$rootOrgNode = new OrgNode();

		$this->_orgChart = new OrgChart();
		$tempOrgChart = $this->_orgChart;

		$tempOrgChart->_idColumn = $this->_idColumn;
		$tempOrgChart->_supervisorColumn = $this->_supervisorColumn;

    	$checkMoreTime = 0;
    	$pushBack = false;

		if($this->IsNullOrEmptyString($this->_idColumn) || $this->IsNullOrEmptyString($this->_supervisorColumn)){
			//$this->_orgChart->title="id or supervisor column name have not set.";
			$tempOrgChart->title = "id or supervisor column name have not set.";
			$this->_orgChart = $tempOrgChart;
			return $this->_orgChart;
		}

    	if($dataSet === null)
    		$dataSet = $this->select();

    	// create $root as OrgNode, PHP is pass by reference when assign object,
    	// otherwise, you need to assign $root back to the $OrgChart->root
    	$root = $tempOrgChart->CreateEmptyNode();
    	$root = $tempOrgChart->root;

		if(count($dataSet['num_rows'])<=0){
			//$this->_orgChart->title="no rows selected";
			$tempOrgChart->title = "no rows selected";
			$this->_orgChart = $tempOrgChart;
			return $this->_orgChart;
		}

		// find the root node
		$copyOfDataSet = $dataSet["data"];
		while (count($copyOfDataSet)>0) {
			# code...
			$mayBeRoot = array_shift($copyOfDataSet);
    	//print_r($mayBeRoot);


			if(!isset($mayBeRoot["supervisor"]) || 
				$mayBeRoot["supervisor"] == null || 
				$mayBeRoot["supervisor"] == ""){
				$rootNode = $tempOrgChart->CreateNode($mayBeRoot);
				if($root->id == ""){
					$root = $rootNode;
					break;
				}else{
					$rootNode->type = "collateral";
					array_push($root->children, $rootNode);
					//break;
				}
			}

		}

		//


		// add node as a child to parent
		$copyOfDataSet = $dataSet["data"];

		$counter = 0;
		while(count($copyOfDataSet)>0 || $checkMoreTime>0){
			$row = array_shift($copyOfDataSet);
			$node = $tempOrgChart->CreateNode($row);

			//if($counter==1)
			//	print_r($root);

			$checkMoreTime--;
			$counter++;
			if($checkMoreTime==0){
				//echo $node->id." ".$node->title." cannot found parent and looped a around, remove.";
				$pushBack = false;
				$checkMoreTime =0;
				continue;
			}

			if(!isset($node->supervisorID) || $node->supervisorID == null || $node->supervisorID=="")
				continue;

			$isFound = $tempOrgChart->FindParent($root, $node);


			if($isFound === false){
				array_push($copyOfDataSet, $row);
				if(!$pushBack){
					$pushBack = true;
					$checkMoreTime = count($copyOfDataSet);
				}
			}else{

				$checkMoreTime = 0;
				$pushBack = false;


				$root = $tempOrgChart->AddChild($root, $node);
			}
		}
		//return;

		//$copy_of_root

		$tempOrgChart->root = $root;

    	return $this->_orgChart;

    }
}

class OrgChart{
	protected $id;
	protected $title;
	protected $root;
	public $_idColumn;
	public $_supervisorColumn;

	function __construct(){
		$this->Initialize();
	}

	function Initialize(){
		$this->id = 1;
		$this->title = "data: bad specification";
		//$this->root = array(title => '', subtitle =>'', children=>array());

		//$this->root = $this->CreateEmptyNode();
		$this->root = $this->CreateEmptyNode();
	}
	function IsNullOrEmptyString($question){
		return (!isset($question) || trim($question)==='');
	}

	function AddChild(&$node, $child){
		//echo "T1";
		$idColumn = $this->_idColumn;
		$supervisorID = $this->_supervisorColumn;

		if(!isset($node->id) || empty($node->id)){
			$node = $child;

			return $node;
		}

		if($node->id == $child->supervisorID){
			//if($node->children === null)
			//	$node->children = array();
			array_push($node->children, $child);

			return $node;
		}
		if($node->supervisorID == $child->id){
			array_push($child->children, $node);

			return $child;
		}

		if(isset($node->children) && count($node->children) > 0){
			for($i=0; $i<count($node->children); $i++){
				//$isFound = $this->CreateNode();
				$isFound = $this->AddChild($node->children[$i], $child);
				if($isFound === false){

				}else{
					$node->children[$i] = clone $isFound;
					return $node;
				}
			}
		}

		return false;
	}

	function FindParent($node, $child){
		if($node->id == ""){
			return true;
		}
		if($node->id == $child->supervisorID){
			return true;
		}
		if($node->supervisorID == $node->id){
			return true;
		}

		if(isset($node->children) && count($node->children)>0){
			for($i=0; $i<count($node->children); $i++){
				$isFound = $this->FindParent($node->children[$i], $child);
				if($isFound === true){
					return true;
				}
			}
		}
		return false;
	}

	function CreateEmptyNode(){
		$orgNode = new OrgNode();
		$orgNode->id = "";
		$orgNode->title = "";
		$orgNode->supervisorID = "";
		$orgNode->image = "";
		$orgNode->children = array();
		return $orgNode;
	}

	function CreateNode($dataRow){
		$orgNode = new OrgNode();

		$tempIDColName = $this->_idColumn;
		$tempSuperIDColName = $this->_supervisorColumn;

		$orgNode->id = $dataRow[$tempIDColName];
		$orgNode->supervisorID = $dataRow[$tempSuperIDColName];
		$orgNode->title = $dataRow['fullName'];
		$orgNode->subtitle = $dataRow['position'];

		if(isset($dataRow['imagePath']) && $dataRow['imagePath'] != null && $dataRow['imagePath'] != "")
			$orgNode->image = $dataRow[$tempIDColName] .'/'. $dataRow['imagePath'];
		return $orgNode;
	}


    /**
     * Magic Methods: __set(), __set() is run when writing data to inaccessible properties.
     * so it is suitable for any initialization that the object may need before it is used.
	 * 
	 * @param string $name, The $name argument is the name of the property being interacted with.
	 * @param string $value, The __set() method's $value argument specifies the value the $name'ed property should be set to.
     */
    function __set($name, $value) {
        $method = 'set' . ucfirst($name);
			if (method_exists($this, $method)) {
				// Top Priority - if TableNameManager have setName method
				$this->$method($value);
			}else if (isset($this->$name)) {
				// Last Priority - if DatabaseManager have variable name as $name
				$this->$name = $value;
			}else {
				//throw new Exception('Manager cannot found and set table column or Parent variable!');
			}
    }
    
	/**
	 * Magic Methods: __get(), __get() is utilized for reading data from inaccessible properties.
	 * 
	 * @param string $name, The $name argument is the name of the property being interacted with.
	 * //may be controller need not to get
	 */
    function __get($name) {
        $method = 'get' . ucfirst($name);
		//if($this->issetDefaultValue){
        if (method_exists($this, $method)){
            return $this->$method();
        }else if (isset($this->$name)){
			return $this->$name;
        }
        //else
            //throw new Exception('Manager cannot found and get table column or Parent variable!');
		//}
    }
	
    public function __call($k, $args) {
        if (preg_match_all('/(set|get)([A-Z][a-z0-9]+)+/', $k, $words)) {
            $firstWord = $words[1][0]; // set or get
            $methodName = strtolower(array_shift($words[2]));
            //first word of property name

            foreach ($words[2] as $word) {
                $methodName .= ucfirst($word);
            }
            if (method_exists($this, $methodName)) {
                $methodObj = array(&$this, $methodName);
                if ($firstWord == 'set') {
                    call_user_func_array($methodObj, $args);
                    return;
                }
                else {
                    return call_user_func_array($methodObj, NULL);
                }
            }
        }
        throw new Exception('tableObject call undefined function() or property!');
    }
}

class OrgNode{
	public $id;
	public $supervisorID;
	public $title;
	public $subtitle;
	public $image;
	public $children;

	function __construct(){
		$this->Initialize();
	}
	function Initialize(){
		$this->title = '';
		$this->subtitle = '';
		$this->image = '';
		$this->id = '';
		$this->supervisorID = '';
		$this->children = array();
		//$this->children = null;
	}


    /**
     * Magic Methods: __set(), __set() is run when writing data to inaccessible properties.
     * so it is suitable for any initialization that the object may need before it is used.
	 * 
	 * @param string $name, The $name argument is the name of the property being interacted with.
	 * @param string $value, The __set() method's $value argument specifies the value the $name'ed property should be set to.
     */
    function __set($name, $value) {
        $method = 'set' . ucfirst($name);
			if (method_exists($this, $method)) {
				// Top Priority - if TableNameManager have setName method
				$this->$method($value);
			}else if (isset($this->$name)) {
				// Last Priority - if DatabaseManager have variable name as $name
				$this->$name = $value;
			}else {
				//throw new Exception('Manager cannot found and set table column or Parent variable!');
			}
    }
    
	/**
	 * Magic Methods: __get(), __get() is utilized for reading data from inaccessible properties.
	 * 
	 * @param string $name, The $name argument is the name of the property being interacted with.
	 * //may be controller need not to get
	 */
    function __get($name) {
        $method = 'get' . ucfirst($name);
		//if($this->issetDefaultValue){
        if (method_exists($this, $method)){
            return $this->$method();
        }else if (isset($this->_[$name])){
            //return $this->_[$name];
            return $this->GetSQLValueString($name);
        }else if (isset($this->$name)){
			return $this->$name;
        }
        //else
            //throw new Exception('Manager cannot found and get table column or Parent variable!');
		//}
    }
	
    public function __call($k, $args) {
        if (preg_match_all('/(set|get)([A-Z][a-z0-9]+)+/', $k, $words)) {
            $firstWord = $words[1][0]; // set or get
            $methodName = strtolower(array_shift($words[2]));
            //first word of property name

            foreach ($words[2] as $word) {
                $methodName .= ucfirst($word);
            }
            if (method_exists($this, $methodName)) {
                $methodObj = array(&$this, $methodName);
                if ($firstWord == 'set') {
                    call_user_func_array($methodObj, $args);
                    return;
                }
                else {
                    return call_user_func_array($methodObj, NULL);
                }
            }
        }
        throw new Exception('tableObject call undefined function() or property!');
    }
}
?>
