<?php
include("../conexion.php");
include ("../sea_metodos.php");
include("evidencias_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{

	$action = trim($_REQUEST['action']);
	

	if(isset($_REQUEST['userToken'])){
		$userToken = trim($_REQUEST['userToken']);
		$data['inicioPeriodo'] = validar(trim($_REQUEST['inicioPeriodo']), $strNum);
		$data['finPeriodo'] = validar(trim($_REQUEST['finPeriodo']), "/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/");

		$obj = new Evidencia($conn, $userToken);
	
	

		if(strcmp($obj->permiso(), 'Administrador')==0){//si es admin puede elejir
				$data['cod_facultad'] = validar(trim($_REQUEST['cod_facultad']), $strNum);//enviado por query string
		}else{//de lo contrario, se toma la facultad que corresponde
			$data['cod_facultad'] = $token->cod_facultad;
		}
		if($obj->permiso()){
			switch ($action) {
				case 'upload':
				$obj->upload($data);
				break;
				case 'download':
				$obj->download($data);
				break;
				default:
						# code...
				break;
			}
		}//fin if($token->permiso)
	}//if(isset($_REQUEST['userToken']))
	$conn->close();
}//else
?>