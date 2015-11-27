<?php
require_once '../model/OrgChartManager.php';
$orgChartManager = new OrgChartManager();
$orgChartManager->debug = true;

$orgChartManager->_idColumn = "staffID";
$orgChartManager->_supervisorColumn = "supervisor";


//$responseData = $orgChartManager->select();
//print_r($responseData);

$orgChartSchema = new OrgChart();

$orgChartSchema = $orgChartManager->ConvertData2OrgChartSchema();
//print_r($orgChartSchema);
//echo $orgChartSchema;

//$orgChartSchema->id = 123;
//$orgChartSchema->title = "title";

//echo json_encode((array)$orgChartSchema, JSON_PRETTY_PRINT);


echo str_replace('*', "", str_replace('\\u0000', "", json_encode((array)$orgChartSchema, JSON_PRETTY_PRINT)));

//echo json_encode(explode('\\u0000', json_encode((array)$orgChartSchema)));




?>