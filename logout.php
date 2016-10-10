<?php
/*include ("conexion.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{*/
	header("Access-Control-Allow-Origin: http://localhost:9000");
	session_id('uid');
	session_start();
	session_destroy();
	session_commit();

	//$conn->close();
//}
?>