<?php
/*
*LOGIN
*PHP
*/
include ("conexion.php");
include("sea_metodos.php");
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}else{

	sleep(2); // esperamos dos segundos para no bombardear la base de datos

	$request = json_decode(file_get_contents('php://input'), true); // get user from json headers

	$user = array();
	$user['pass'] = validar($request['pass'],"/^[a-zA-Z0-9 ñáéíóúÑÁÉÍÓÚ]*$/");
	$user['email'] = validarEmail($request['email']);

	$result = $conn->query('SELECT * FROM usuario WHERE email = "' . $user['email'] . '" 
		AND BINARY pass = "'.$user['pass'].'" AND estado = "ACTIVO"'); // BINARY en pass para que sea case sensitive
	$check = mysqli_num_rows($result);
	if($check === 1){
		$outp = ""; // String que convertiremos al formato JSON

		$token = array();
		$rs = $result->fetch_array(MYSQLI_ASSOC);


		$token['permiso']=$rs["permiso"];
		$token['nombre']=$rs["nombre"];
		$token['apellidos']=$rs["apellidos"];
		$token['email']=$rs["email"];
		$token['cod_facultad']=$rs["cod_facultad"];
		$token['time']= date('Y-m-d H:i:s');

		$tokenBrowser = JWT::encode($token, 'gr874AD84984reg_rfe687687rgAJHLI65484KHJ56465_4365RGsdg3r4g6er48g3zz');
		$outp .= '{"permiso":"'  . $rs["permiso"] . '",';
		$outp .= '"token":"'   .$tokenBrowser. '"}';

		$obj = new SEA($conn, $tokenBrowser);
		$obj->logg('Inicio de Sesión');
		$conn->close();
		echo ($outp);

	}
}
?>

