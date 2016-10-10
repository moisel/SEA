<?php

/*
*PHP 
*Usuarios
*/

include ("../conexion.php");
include ("../sea_metodos.php");
include("usuarios_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{

	$action = trim($_REQUEST['action']);
	$userToken = trim($_REQUEST['userToken']);

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata, true);

	$obj = new Usuario($conn, $userToken);
	$data = array();


	$data['rut'] = validar($request['rut'], $strRut);	
	$data['nombre'] = validar($request['nombre'], $strReg);
	$data['apellidos'] = validar($request['apellidos'], $strReg);
	$data['email'] = validarEmail($request['email']);

	$data['permiso'] = '';
	$data['cod_facultad'] = '';
	$data['estado'] = '';
	$data['nuevaPass'] = '';
	$data['nuevaPass2'] = '';
	$data['oldEmail'] = '';
	$data['pass'] = '';


	if(isset($request['permiso'])){
		$data['permiso'] = validar($request['permiso'], '(Secretario|Administrador)');
	}
	if (isset($request['cod_facultad'])) {
		$data['cod_facultad'] = validar($request['cod_facultad'], $strNum);
	}
	if (isset($request['estado'])) {
		$data['estado'] = validar($request['estado'], $strEst);
	}
	if(isset($request['nuevaPass'])){
		$data['nuevaPass'] = validar($request['nuevaPass'], $strComp);
	}
	if(isset($request['nuevaPass2'])){
		$data['nuevaPass2'] = validar($request['nuevaPass2'], $strComp);
	}
	if(isset($request['oldEmail'])){
		$data['oldEmail'] = validarEmail($request['oldEmail']);
	}

	if(isset($request['pass'])){
		$data['pass'] = validar($request['pass'], $strComp);
	}
	//echo $request['email'];
	if(isset($_REQUEST['email'])){
		$email = validarmail(trim($_REQUEST['email']));//ocupado para reenvío
	}
	if($obj->permiso()){
		switch ($action) {
			case 'ver':
			$obj->ver();
			break;
			case 'verPerfil':
			$obj->verPerfil();
			break;
			case 'actualizarPerfil':
			$obj->actualizarPerfil($data);
			break;
			case 'editarUsuario':
			$obj->editarUsuario($data);
			break;
			case 'agregarUsuario':
			$obj->agregarUsuario($data);
			break;
			case 'reenviarPassword':
			if(strcmp($obj->permiso(), 'Administrador')==0){//RELEASE
				$obj->reenviarPassword($email);
			}
			break;
			default:
				# code...
			break;
		}
	}
	
	$conn->close();
}
?>
