<?php
header('Content-Type: application/json');
require_once '../model/FormSubmitManager.php';
require_once '../model/DatabaseManager.php';
require_once '../model/SecurityManager.php';
require_once '../model/ProductManager.php';

$productManager = new ProductManager();
$productManager->topRightToken = true;

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

$tableName = FormSubmit::POST("table");
$crudType = FormSubmit::POST("crud-type");


$productManager->debug = true;

if(isset($_POST["updateTo"]))
foreach($_POST["updateTo"] as $key => $value) {
	$productManager->$key = $value;
}

	// move image
	$productID = $productManager->productID;
	$imagePath = $productManager->bannerURL;
	if(isset($imagePath)){
		$productID = trim($productID, "'");
		$imagePath = trim($imagePath, "'");

		if (!file_exists(BASE_RESOURSE."productImage/$productID")) {
		    mkdir(BASE_RESOURSE."productImage/$productID", 0777, true);
		}
		if(file_exists("../temp/upload/$imagePath"))
		rename("../temp/upload/$imagePath", BASE_RESOURSE."productImage/$productID/$imagePath");
	}

echo json_encode($productManager->update());

?>