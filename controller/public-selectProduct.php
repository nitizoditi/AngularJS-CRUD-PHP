<?php
require_once '../model/ProductManager.php';
require_once '../model/FormSubmitManager.php';
$productManager = new ProductManager();
$productManager->debug = true;
$productManager->Initialize();

$pageNum = FormSubmit::GET("page");
$count = FormSubmit::GET("count");
$step = FormSubmit::GET("step");

if($pageNum=="")
	$pageNum = 1;

if($step>0)
	$productManager->selectStep = $step;

	//$productManager->selectStep = 1;

//if($count)
//echo json_encode($productManager->count());
//	else
echo json_encode($productManager->selectPage($pageNum));
?>