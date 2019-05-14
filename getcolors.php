<?php
ini_set('display_errors',1);
error_reporting(E_ALL);
$data = file_get_contents("color_list.json");
echo $data;
?>