<?php

/*
*PHP 
*Periodo
*/

include ("../conexion.php");
include ("../sea_metodos.php");
include("periodo_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{
	$action = trim($_REQUEST['action']);

	$userToken=trim($_REQUEST['userToken']);

	$obj = new Periodo($conn, $userToken);

	if(isset($_REQUEST['inicioPeriodo'])){
			$inicioPeriodo = validar(trim($_REQUEST['inicioPeriodo']), $strNum);//enviado por query string
	}
	
	if($obj->permiso()){
		switch ($action) {
			case 'ver':
				$obj->ver();
				break;
			case 'iniciarPeriodo':
			if(strcmp($obj->permiso(), 'Administrador')==0){//RELEASE
				$obj->iniciar($inicioPeriodo);
			}
			break;

			case 'finalizarPeriodo':
			if(strcmp($obj->permiso(), 'Administrador')==0){
				$obj->finalizar();
			}
			break;

			case 'existePeriodo':
			$obj->existePeriodo(true);
			break;

			default:
			# code...
			break;
		}
	}//if($token->permiso){
	
	$conn->close();
}
?>