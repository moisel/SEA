<?php

/*
*PHP 
*Departamentos
*/

include ("../conexion.php");
include("../sea_metodos.php");
include("departamentos_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{
	$action = trim($_REQUEST['action']);//acción a realizar (en switch)
	$userToken = trim($_REQUEST['userToken']);

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata, true);

	$obj = new Departamento($conn, $userToken);

	$data = array();
	$data['nombre'] = validar($request['nombre'], $strReg);
	$data['cod_facultad'] = validar($request['cod_facultad'], $strNum);
	$data['estado'] = validar($request['estado'], $strEst);

	$data['oldFacultad']='';//dato que podría no venir
	if (isset($request['oldFacultad'])) {
		$data['oldFacultad']=validar($request['oldFacultad'], $strNum);
	}

	$data['cod_departamento']='';//dato que podría no venir
	if (isset($request['cod_departamento'])) {
		$data['cod_departamento'] = validar($request['cod_departamento'], $strNum);
	}

	if(strcmp($obj->permiso(), 'Administrador')==0){//si es admin puede elejir
		if(isset($_REQUEST['cod_facultad'])){
			$cod_facultad =  validar($_REQUEST['cod_facultad'], $strNum);//enviado por query string
		}
	}else{//de lo contrario, se toma la facultad que corresponde
		$data['cod_facultad'] = $obj->facultad();//sobrescribimos lo que nos enviaron
		$cod_facultad = $obj->facultad();//no es necesario el nombre en la query string
	}

	if(isset($_REQUEST['cod_departamento'])){
			$cod_departamento = validar(trim($_REQUEST['cod_departamento']), $strNum);//enviado por query string
	}

	/*Módulo sólo para administradores*/
	if((strcmp($obj->permiso(), 'Administrador')==0)){
		switch ($action) {
			case 'ver':
				$obj->ver();
				break;
			case 'verDeUnaFacultad':
				$obj->verDeUnaFacultad($cod_facultad);
				break;
			case 'agregarDepartamento':
				$obj->agregarDepartamento($data);
				break;
			case 'editarDepartamento':
				$obj->editarDepartamento($data);
				break;
			case 'verUna':
				$obj->verUna($cod_departamento);
				break;
			default:
				# code...
				break;
		}//switch
	}else{//funciones disponibles para todos
			switch ($action) {
			case 'ver':
				$obj->ver();
				break;
			case 'verDeUnaFacultad':
				$obj->verDeUnaFacultad($cod_facultad);
				break;
			case 'verUna':
				$obj->verUna($cod_departamento);
				break;
			default:
				# code...
				break;
		}//switch
	}//else
	
	$conn->close();
}
?>