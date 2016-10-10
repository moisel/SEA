<?php
/*
*Usuarios 
*Metodos 
*PHP
*/
class Usuario extends SEA {

	function __construct($conn, $token){
		parent::__construct($conn, $token);	
	}
function verPerfil(){

	$result = $this->conn->query('SELECT * FROM usuario WHERE email = "'.$this->token->email.'" AND estado = "ACTIVO"');
	$check = mysqli_num_rows($result);
	if($check === 1){
		$outp = '';
		$rs = $result->fetch_array(MYSQLI_ASSOC);
		$outp .= '{"email":"'  . $rs["email"] . '",';
		$outp .= '"rut":"'   . $rs["rut"] . '",';
		$outp .= '"nombre":"'   . $rs["nombre"] . '",';
		$outp .= '"apellidos":"'   . $rs["apellidos"] . '"}'; 
		echo($outp);
	}

}

function actualizarPerfil($data){//esta función es sólo para el propio ususario
	sleep(2); // en caso de que alguien quiera utilizar un diccionario o algo por el estilo
	if($this->verificarContrasena($data)){//el usuario ingresó correctamente su propia contraseña?
		$validacion = true;//partimeos dando la opción de grabar el perfil, que quitaremos según corresponda
		if(strcmp($data['oldEmail'], $data['email'])!=0){
			$validacion = $this->emailDesocupado($data);
		}
		if(((strcmp($data['nuevaPass'], '')!=0) || (strcmp($data['nuevaPass2'], '')!=0))//si ingresan cualquira de las dos
			&& strcmp($data['nuevaPass'], $data['nuevaPass2'])!=0){//comparemosla
			$validacion = false;// venía con contraseña/s nuevas, pero eran distintas
		}
		if($validacion){
			$this->grabarPerfil($data);
		}else{//no hay mensaje para contraseñas, se supone que ya están validadas por formulario
			print(false);//corro ocupado
		}
	}else{// if(verificarContrasena($this->conn, $data))
		print(false);//contraseña inválida
	}

}

function verificarContrasena($data){
	//$this->logg($data['pass']);
	$result = $this->conn->query('SELECT * FROM usuario WHERE email = "'.$data['oldEmail'].'"
		AND pass = "'.$data['pass'].'" ');
	$check = mysqli_num_rows($result);
	if($check === 1){
		return true;
	}else{
		return false;
	}
}

function emailDesocupado($data){
	$result = $this->conn->query('SELECT * FROM usuario WHERE email = "'.$data['email'].'"');
	$check = mysqli_num_rows($result);
	if($check === 0){
		return true;
	}else{
		return false;
	}
}

function grabarPerfil($data){//esta función es sólo para el propio usuario
	$sql='';
	if($data['nuevaPass'] && $data['nuevaPass2']){
		$sql = 'UPDATE usuario 
		SET email = "' . $data['email'] . '",
		rut = "' . $data['rut'] . '",
		pass = "' . $data['nuevaPass'] . '",
		nombre = "' . $data['nombre'] . '",
		apellidos = "' . $data['apellidos'] . '"
		WHERE email = "' . $data['oldEmail'] . '"';
	}else{
		$sql = 'UPDATE usuario 
		SET email = "' . $data['email'] . '",
		rut = "' . $data['rut'] . '",
		nombre = "' . $data['nombre'] . '",
		apellidos = "' . $data['apellidos'] . '"
		WHERE email = "' . $data['oldEmail'] . '"';
	}
	$this->logg('Edita su propio Perfil');
	$this->conn->query($sql);
	print(true);

}

function reenviarPassword($email){
	$newPassword = $this->randomPassword();
	$sql = 'UPDATE usuario 
	SET pass = "' . sha1($newPassword) . '"
	WHERE email = "' . $email . '"';
	$this->conn->query($sql);
	$this->sendEmail($email, $newPassword);
	$this->logg('Reenvía contraseña a '.$email.'');
	print('"Contraseña Reenviada"');
}

function randomPassword() {
	$alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    $pass = array();//lo declaramos como arry para luego operarlo
    $alphaLength = strlen($alphabet) - 1; //-1 para no salirnos del rango
    for ($i = 0; $i < 8; $i++) {
    	$n = rand(0, $alphaLength);//asignamos algún número del rango a n
    	$pass[] = $alphabet[$n];//entonces le pasamos a la pass la letra que va en el lugar seleccionado
    }
    return implode($pass); //transformamos el array en una string
}

function sendEmail($to, $pass){
	$subject = "Bienvenido a SEA";

	$message = "
	<html>
	<head>
		<title>Bienvenido a SEA</title>
	</head>
	<body>
		<p>Usted podrá ingresar al sistema con las siguientes credenciales:</p>
		<table>
			<tr>
				<th>Correo</th>
				<th>Contraseña</th>
			</tr>
			<tr>
				<td>".$to."</td>
				<td>".$pass."</td>
			</tr>
		</table>
	</body>
	</html>
	";

// Always set content-type when sending HTML email
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
	$headers .= 'From: <sea@ucm.cl>' . "\r\n";
//$headers .= 'Cc: myboss@example.com' . "\r\n";

	mail($to,$subject,$message,$headers);
}

function agregarUsuario($data){
	$result = $this->conn->query('SELECT * FROM usuario WHERE email = "' . $data['email'] . '"');
	$check = mysqli_num_rows($result);
		if($check === 0 && (strcmp($data['email'], '')!=0)){//si no existe usuario con tal email en la base de datos
			$pass = $this->randomPassword();//el generamos un password
			$sql = 'INSERT INTO usuario (email, permiso, cod_facultad, rut, pass, nombre, apellidos, estado) 
			VALUES (
				"' . $data['email'] . '",
				"' . $data['permiso'] . '",
				"' . $data['cod_facultad'] . '",
				"' . $data['rut'] . '",
				"' . sha1($pass) . '",
				"' . $data['nombre'] . '",
				"' . $data['apellidos'] . '",
				"ACTIVO"
				)';
			$this->conn->query($sql);
			$this->sendEmail($data['email'], $pass);
			$this->logg('Ingresa Usuario con email '.$data['email'].' y permiso '.$data['permiso'].'');
			print(true);
		}
}

function editarUsuario($data){
	if(strcmp($data['estado'], 'INACTIVO')==0 && strcmp($data['permiso'], 'Administrador')==0){
		//si tratamos de desactivar a un administrador
		$result = $this->conn->query('SELECT * FROM usuario WHERE estado = "ACTIVO" AND permiso = "Administrador"');
		$check = mysqli_num_rows($result);
		if ($check<2) {//si nos quedaríamos sin administradores activos después del update
			$data['estado'] = "ACTIVO";//cancelamos la desactivación del Administrador
			$this->logg('Intento de autoeliminación como último Administrador');
		}
	}//fin viendo si se desactiva un Administrador

	$sql = 'UPDATE usuario 
	SET rut = "' . $data['rut'] . '",
	nombre = "' . $data['nombre'] . '",
	apellidos = "' . $data['apellidos'] . '",
	permiso = "' . $data['permiso'] . '",
	cod_facultad = "' . $data['cod_facultad'] . '",
	estado = "' . $data['estado'] . '" 
	WHERE email = "' . $data['email']. '"';
	$this->conn->query($sql);
	$this->logg('Edita Usuario con email '.$data['email'].'');
	print(true);
}

function ver(){
	$result = $this->conn->query('SELECT * FROM usuario');
	$this->imprimir($result);
}
function imprimir($result){
		$outp = "";//String que convertiremos al formato JSON
		while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
			if ($outp != "") {$outp .= ",";}
			$outp .= '{"email":"'  . $rs["email"] . '",';
			$outp .= '"permiso":"'   . $rs["permiso"] . '",';
			$outp .= '"cod_facultad":"'   . $rs["cod_facultad"] . '",';
			$outp .= '"rut":"'   . $rs["rut"] . '",';
			$outp .= '"nombre":"'   . $rs["nombre"] . '",';
			$outp .= '"apellidos":"'   . $rs["apellidos"] . '",';
			$outp .= '"estado":"'   . $rs["estado"] . '"}'; 
		}
		$outp ='{"records":['.$outp.']}';
		echo($outp);
}
}//Usuario
?>
