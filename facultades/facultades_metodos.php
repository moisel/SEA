<?php
/*
*PHP
*Facultades
*Metodos
*/
class Facultad extends SEA {

	function __construct($conn, $token){
		parent::__construct($conn, $token);	
	}
function verActivas(){
	$result = $this->conn->query('SELECT * FROM facultad WHERE estado = "ACTIVO"');
	$this->imprimir($result);
}
function ver(){
	$result = $this->conn->query('SELECT * FROM facultad');
	$this->imprimir($result);
}
function verUna($cod_facultad){
	$result = $this->conn->query('SELECT * FROM facultad WHERE cod_facultad="'.$cod_facultad.'"');
	$this->imprimir($result);
}
function agregarFacultad($data){
	$result = $this->conn->query('SELECT * FROM facultad WHERE nombre = "' . $data['nombre'] . '"');
	$check = mysqli_num_rows($result);
	if($check === 0 && (strcmp($data['nombre'], '')!=0)){
		$sql = 'INSERT INTO facultad (nombre, decano, estado) VALUES ("' . $data['nombre'] . '", "' . $data['decano'] . '", "ACTIVO")';
		$this->conn->query($sql);
		$this->logg('Agrega Facultad con nombre '.$data['nombre'].'');
		print(true);
	}else{
		print(false);
	}
	
}
function editarFacultad($data){
	if(strcmp($data['oldFacultad'], $data['nombre']) != 0){//si el usuario cambió el nombre de la Facultad
		$result = $this->conn->query('SELECT * FROM facultad WHERE nombre = "' . $data['nombre'] . '"');
		$check = mysqli_num_rows($result);
		if($check === 0 && (strcmp($data['nombre'], '')!=0)){
			$sql = 'UPDATE facultad 
				SET 
				nombre = "' . $data['nombre'] . '",
				decano = "' . $data['decano'] . '",
				estado =  "' . $data['estado'] . '" 
				WHERE cod_facultad = "' . $data['cod_facultad'] . '"';
				$this->conn->query($sql);
				$this->logg('Edita Facultad con código '.$data['cod_facultad'].' con cambio de nombre');
				print(true);
		}else{
			print(false);
		}
	}else{
		$sql = 'UPDATE facultad 
				SET 
				decano = "' . $data['decano'] . '",
				estado =  "' . $data['estado'] . '" 
				WHERE cod_facultad = "' . $data['cod_facultad'] . '"';
				$this->conn->query($sql);
				$this->logg('Edita Facultad con código '.$data['cod_facultad'].'');
				print(true);
	}
}
function imprimir($result){
	$outp = "";//String que convertiremos al formato JSON
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"cod_facultad":"'  . $rs["cod_facultad"] . '",';
		$outp .= '"nombre":"'   . $rs["nombre"]        . '",';
		$outp .= '"decano":"'   . $rs["decano"]        . '",';
		$outp .= '"estado":"'. $rs["estado"]     . '"}'; 
	}

	$outp ='{"records":['.$outp.']}';
	echo($outp);
}
}//Facultad
?> 