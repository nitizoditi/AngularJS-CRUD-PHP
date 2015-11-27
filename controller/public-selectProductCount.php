<?php
require_once '../model/ProductManager.php';
require_once '../model/FormSubmitManager.php';
$productManager = new ProductManager();
$productManager->debug = true;
$productManager->Initialize();

echo json_encode($productManager->count());
?>