<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
require_once '../model/ProductManager.php';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$productManager = new ProductManager();

/*
$post = json_decode($_POST);
print_r($post);

$create = FormSubmit::POST("create");

if($create)
	print_r($create);
*/

if(isset($_POST["create"]))
foreach($_POST["create"] as $key => $value) {
	if(isset($_POST["createDate"])){
		if(!array_key_exists($key, $_POST["createDate"]))
			$productManager->$key = $value;
	}else{
			$productManager->$key = $value;
	}
}

if(isset($_POST["createDate"]))
	foreach($_POST["createDate"] as $key => $value) {
		$productManager->$key = $value;
	}

$productManager->topRightToken = true;

//var_dump($_POST);
/*
if(is_array($_POST))
	echo "is Array";
else
	echo "is not Array";
if(is_object($_POST))
	echo "is Object";
else
	echo "is not Object";
*/

// insert profile
$responseArray = $productManager->insert();

if($responseArray['affected_rows']>0){
	// move image
	$staffID = $responseArray['insert_id'];
	$imagePath = $productManager->bannerURL;
	if(isset($imagePath)){
		$staffID = trim($staffID, "'");
		$imagePath = trim($imagePath, "'");

		if (!file_exists(BASE_RESOURSE."productImage/$staffID")) {
		    mkdir(BASE_RESOURSE."productImage/$staffID", 0777, true);
		}
		if(file_exists("../temp/upload/$imagePath"))
		rename("../temp/upload/$imagePath", BASE_RESOURSE."productImage/$staffID/$imagePath");
	}
}
/*
if($responseArray['affected_rows']>0){
	//echo "1";
	$userID = $responseArray['insert_id'];
	//$productManager->profileID = $profileID;
	$productManager->userID = $userID;

	//echo json_encode($productManager->_, JSON_PRETTY_PRINT);
	$productManager->update(true);
}
*/

echo json_encode($responseArray, JSON_PRETTY_PRINT);
?>