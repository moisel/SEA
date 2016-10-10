<?php

/*
*PHP 
*Evaluaciones
*/

include ("../conexion.php");
include ("../sea_metodos.php");
include("evaluaciones_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{

	$action = trim($_REQUEST['action']);
	$userToken=trim($_REQUEST['userToken']);

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata, true);

	$obj = new Evaluacion($conn, $userToken);
	
	$data = array();
	$data['rutAcademico']=validar($request['rutAcademico'], $strRut);
	$data['nombresAcademico']=validar($request['nombresAcademico'], $strReg);
	$data['apellidosAcademico']=validar($request['apellidosAcademico'], $strReg);
	$data['cod_facultad']=validar($request['cod_facultad'], $strNum);
	$data['cod_departamento']=validar($request['cod_departamento'], $strNum);
	$data['tituloProfesionalAcademico']=validar($request['tituloProfesionalAcademico'], $strReg2);
	$data['horasAcademico']=validar($request['horasAcademico'], $strNum);
	$data['categoriaAcademico']=validar($request['categoriaAcademico'], '(-----|Instructor|Auxiliar|Adjunto|Titular)');
	$data['gradoAcademico']=validar($request['gradoAcademico'], $strReg);
	$data['tipoPlantaAcademico']=validar($request['tipoPlantaAcademico'], '/^[a-zA-Z0-9° ñáéíóú]*$/');
	$data['calificacionAnteriorAcademico']=validar($request['calificacionAnteriorAcademico'], $strNum2);
	$data['tiempo1']=validar($request['tiempo1'], $strNum);
	$data['tiempo2']=validar($request['tiempo2'], $strNum);
	$data['tiempo3']=validar($request['tiempo3'], $strNum);
	$data['tiempo4']=validar($request['tiempo4'], $strNum);
	$data['tiempo5']=validar($request['tiempo5'], $strNum);
	$data['nota1']=validar($request['nota1'], $strNum2);
	$data['nota2']=validar($request['nota2'], $strNum2);
	$data['nota3']=validar($request['nota3'], $strNum2);
	$data['nota4']=validar($request['nota4'], $strNum2);
	$data['nota5']=validar($request['nota5'], $strNum2);
	$data['ponderado1']=validar($request['ponderado1'], $strNum2);
	$data['ponderado2']=validar($request['ponderado2'], $strNum2);
	$data['ponderado3']=validar($request['ponderado3'], $strNum2);
	$data['ponderado4']=validar($request['ponderado4'], $strNum2);
	$data['ponderado5']=validar($request['ponderado5'], $strNum2);
	$data['rutComision']=validar($request['rutComision'], $strRut);
	$data['miembro1Comision']=validar($request['miembro1Comision'], $strReg);
	$data['miembro2Comision']=validar($request['miembro2Comision'], $strReg);
	$data['decanoComision']=validar($request['decanoComision'], $strReg);
	$data['inicioPeriodo']=$request['inicioPeriodo'];
	$data['finPeriodo']=$request['finPeriodo'];
	$data['argumento']=validar($request['argumento'], '/^[a-zA-Z ñáéíóúÑÁÉÍÓÚ\.-]*$/');
	$data['notaFinal']=validar($request['notaFinal'], $strNum2);

	if(strcmp($obj->permiso(), 'Administrador')==0){//si es admin puede elejir
		//$data['cod_facultad'] = $request['cod_facultad'];
		if(isset($_REQUEST['cod_facultad'])){
			$cod_facultad = validar(trim($_REQUEST['cod_facultad']), $strNum);//enviado por query string
		}
	}else{//de lo contrario, se toma la facultad que corresponde
		$data['cod_facultad'] = $obj->facultad();//sobrescribimos lo que nos enviaron (seguridad)
		$cod_facultad = $obj->facultad();//el nombre de la facultad es la que le corresponde
	}
	if(isset($_REQUEST['inicioPeriodo'])){
			$inicioPeriodo = validar(trim($_REQUEST['inicioPeriodo']), $strNum);//enviado por query string
	}
	if(isset($_REQUEST['rutAcademico'])){
			$rutAcademico = validarRut(trim($_REQUEST['rutAcademico']));//enviado por query string
	}
	if(isset($_REQUEST['cod_departamento'])){
			$cod_departamento = validar(trim($_REQUEST['cod_departamento']), $strNum);//enviado por query string
	}
	

	if($obj->permiso()){
		switch ($action) {
			case 'ver'://muestra todas las evaluaciones de todos los años
				if(strcmp($obj->permiso(), 'Administrador')==0){
					$obj->ver();
				}
				break;
			case 'verPorPeriodo':
				$obj->verPorPeriodo($inicioPeriodo);
				break;
			case 'verEvaluacion':
				$obj->verEvaluacion($rutAcademico, $inicioPeriodo);
				break;
			case 'evaluarAcademico':
				$obj->evaluarAcademico($data);
				break;
			case 'evaluacionesAcademico':
				$obj->evaluacionesAcademico($rutAcademico);
				break;
			case 'verPorFacultad'://muestra todas de todos los años
				$obj->verPorFacultad($cod_facultad);
				break;
			case 'verPorDepartamento':
				$obj->verPorDepartamento($cod_departamento);
				break;
			case 'verPeriodoFacultad':
				$obj->verPeriodoFacultad($cod_facultad, $inicioPeriodo);
				break;
			case 'verPeriodoDepartamento':
				$obj->verPeriodoDepartamento($cod_departamento, $inicioPeriodo);
				break;
			case 'editarEvaluacion':
				$obj->editarEvaluacion($data);
				break;
			default:
			# code...
				break;
		}
	}//if(token->permiso)
	
	$conn->close();
}
?>