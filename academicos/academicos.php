<?php

/*
*PHP 
*Academicos
*/

include ("../conexion.php");
include("../sea_metodos.php");
include("academicos_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{

	$action = trim($_REQUEST['action']);//acción a realizar (en switch)
	$userToken = trim($_REQUEST['userToken']);

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata, true);

	$obj = new Academico($conn, $userToken);

	$data = array();
	$data['rut'] = validarRut($request['rut']);
	$data['nombres'] = validar($request['nombres'],$strReg);
	$data['apellidos'] = validar($request['apellidos'], $strReg);
	$data['cod_facultad'] = validar($request['cod_facultad'],$strNum);
	$data['cod_departamento'] = validar($request['cod_departamento'],$strNum);
	$data['tituloProfesional'] = validar($request['tituloProfesional'],$strReg2);
	$data['horas'] = validar($request['horas'],$strNum);
	$data['categoria'] = validar($request['categoria'],'(-----|Instructor|Auxiliar|Adjunto|Titular)');
	$data['gradoAcademico'] = validar($request['gradoAcademico'],$strReg);
	$data['tipoPlanta'] = validar($request['tipoPlanta'],'/^[a-zA-Z0-9° ñáéíóú]*$/');
	$data['estado'] = validar($request['estado'],$strEst);

	if(strcmp($obj->permiso(), 'Administrador')==0){//si es admin puede elejir
		//$data['cod_facultad'] = $request['cod_facultad'];
		if(isset($_REQUEST['cod_facultad'])){
			$cod_facultad = validar(trim($_REQUEST['cod_facultad']), $strNum);//enviado por query string
		}
	}else{//de lo contrario, se toma la facultad que corresponde
		//$data['cod_facultad'] = $token->cod_facultad;
		$data['cod_facultad'] = $obj->facultad();//sobrescribimos lo que nos enviaron
		$cod_facultad = $obj->facultad();//no es necesario el nombre en la query string
	}
	if(isset($_REQUEST['inicioPeriodo'])){
			$inicioPeriodo = validar(trim($_REQUEST['inicioPeriodo']), $strNum);//enviado por query string
	}

	if($obj->permiso()){
		switch ($action) {
			case 'ver':
				$obj->ver();
				break;
			case 'verPorFacultad':
				$obj->verPorFacultad($cod_facultad);
				break;
			case 'verPeriodoFacultad':
				$obj->verPeriodoFacultad($inicioPeriodo, $cod_facultad);
				break;
			case 'agregarAcademico':
				$obj->agregarAcademico($data);
				break;
			case 'editarAcademico':
				$obj->editarAcademico($data);
				break;
			case 'verActivos':
				$obj->verActivos($cod_facultad);
				break;
			default:
				# code...
				break;
		}
	}

	$conn->close();
}
?>