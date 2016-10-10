<?php

/*
*PHP 
*Facultades
*/

include ("../conexion.php");
include("../sea_metodos.php");
include("facultades_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{
	$action = trim($_REQUEST['action']);
	$userToken = trim($_REQUEST['userToken']);

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata, true);

	$obj = new Facultad($conn, $userToken);
	$data = array();

	
	$data['nombre'] = validar($request['nombre'], $strReg2);
	$data['decano'] = validar($request['decano'], $strReg2);
	$data['estado'] = validar($request['estado'], $strEst);
	if(isset($_REQUEST['cod_facultad'])){
		if(strcmp($obj->permiso(), 'Administrador')==0){//si es admin elige
			$cod_facultad = validar(trim($_REQUEST['cod_facultad']), $strNum);//enviado por query string
		}else{
			$cod_facultad = $obj->facultad();
		}
	}
	if(isset($request['oldFacultad'])){//este atributo es posible que no sea llamado en algunos request
		$data['oldFacultad'] = validar($request['oldFacultad'], $strReg2);
	}
	if(isset($request['cod_facultad'])){//este atributo es posible que no sea llamado en algunos request
		$data['cod_facultad'] = validar($request['cod_facultad'], $strNum);
	}
	
	/*Módulo sólo para administradores*/
	if((strcmp($obj->permiso(), 'Administrador')==0)){
		switch ($action) {
			case 'ver':
			$obj->ver();
			break;
			case 'verActivas':
			$obj->verActivas();
			break;
			case 'agregarFacultad':
			$obj->agregarFacultad($data);
			break;
			case 'editarFacultad':
			$obj->editarFacultad($data);
			break;
			case 'verUna':
				$obj->verUna($cod_facultad);
			default:
			# code...
			break;
		}
	}else{//si no es un administrador, solo puede ver su propia facultad
		switch ($action) {
			case 'ver':
				$obj->ver();
				break;
			case 'verUna':
				$obj->verUna($cod_facultad);
				break;
			default:
				echo '"'.$obj->facultad().'"';
				break;
		}//switch
		
	}
	//if($token->permiso){
	
	$conn->close();
}
?>