<?php
require_once '../model/ProfileManager.php';
require_once '../model/FormSubmitManager.php';
$staffManager = new ProfileManager();
$staffManager->debug = true;
$staffManager->Initialize();

$staffID = FormSubmit::POST("staffID");

if($staffID != "")
	$staffManager->staffID = $staffID;

echo json_encode($staffManager->select());
?>