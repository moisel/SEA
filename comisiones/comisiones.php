<?php

/*
*PHP 
*Comisiones
*/

include ("../conexion.php");
include("../sea_metodos.php");
include("comisiones_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{
	$action = trim($_REQUEST['action']);	
	$userToken = trim($_REQUEST['userToken']);

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata, true);

	$obj = new Comision($conn, $userToken);
	$data = array();

	$data['anio'] = validar($request['anio'], $strNum);
	$data['cod_facultad'] = validar($request['cod_facultad'], $strNum);
    $data['rut'] = validar($request['rut'], $strRut);
    $data['decano'] = validar($request['decano'], $strReg);
    $data['miembro1'] = validar($request['miembro1'], $strReg);
    $data['miembro2'] = validar($request['miembro2'], $strReg);
    $data['fechaPie'] = $request['fechaPie'];
    $data['estado'] = validar($request['estado'], $strEst);
    $data['oldAnio']='';
    if (isset($request['oldAnio'])) {
		$data['oldAnio'] = validar($request['oldAnio'], $strNum);
	}

	if(strcmp($obj->permiso(), 'Administrador')==0){//si es admin puede elejir
		//$data['cod_facultad'] = $request['cod_facultad'];
		if(isset($_REQUEST['cod_facultad'])){
			$cod_facultad =  validar(trim($_REQUEST['cod_facultad']), $strNum);//enviado por query string
		}
	}else{//de lo contrario, se toma la facultad que corresponde
		//$data['cod_facultad'] = $token->cod_facultad;
		$data['cod_facultad'] = $obj->facultad();//sobrescribimos lo que nos enviaron
		$cod_facultad = $obj->facultad();//no es necesario el nombre en la query string
	}

	if($obj->permiso()){
		switch ($action) {
			case 'comisionesActivas':
			$obj->comisionesActivas($cod_facultad);
			break;
			case 'agregarComision':
			$obj->agregarComision($data);
			break;
			case 'editarComision':
			$obj->editarComision($data);
			break;
			case 'ver':
			$obj->ver();
			break;
			default:
			# code...
			break;
		}
	}
	
	$conn->close();
}
?>
