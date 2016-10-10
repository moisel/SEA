<?php
class Departamento extends SEA {

	function __construct($conn, $token){
		parent::__construct($conn, $token);	
	}
function ver(){
	$result = $this->conn->query('SELECT * FROM departamento');
	$this->imprimir($result);
}
function verDeUnaFacultad($cod_facultad){//selecciona sólo de una facultad
	$result = $this->conn->query('SELECT * FROM departamento WHERE cod_facultad = "'.$cod_facultad.'"');
	$this->imprimir($result);
}
function verUna($cod_departamento){
	$result = $this->conn->query('SELECT * FROM departamento WHERE cod_departamento="'.$cod_departamento.'"');
	$this->imprimir($result);
}
function agregarDepartamento($data){
	$result = $this->conn->query('SELECT * FROM departamento WHERE nombre = "' . $data['nombre'] . '" AND  cod_facultad = "' . $data['cod_facultad'] . '"');
	$check = mysqli_num_rows($result);
	if($check === 0 && (strcmp($data['nombre'], '')!=0) && (strcmp($data['cod_facultad'], '')!=0)){
		$sql = 'INSERT INTO departamento (nombre, cod_facultad, estado) VALUES ("' . $data['nombre'] . '", "' . $data['cod_facultad'] . '", "ACTIVO")';
		$this->conn->query($sql);
		$this->logg('Ingresa Departamento '.$data['nombre'].' a la Facultad '.$data['cod_facultad'].'');
		print(true);
	}
	
}
function editarDepartamento($data){
	if(strcmp($data['oldFacultad'], $data['cod_facultad']) !== 0){//si el usuario cambió la facultad
		$result = $this->conn->query('SELECT * FROM departamento WHERE nombre =   "' . $data['nombre'] . '" AND cod_facultad =   "' . $data['cod_facultad'] . '"');
		$check = mysqli_num_rows($result);
		if($check==0){//y no existe tal departamento en tal facultad
			$sql = 'UPDATE departamento 
			SET 
			nombre = "'.$data['nombre'].'",
			cod_facultad = "' . $data['cod_facultad'] . '",
			estado =  "' . $data['estado'] . '" 
			WHERE cod_departamento =   "' . $data['cod_departamento'] . '"';
			$this->conn->query($sql);
			$this->logg('Edita Departamento '.$data['nombre'].' Cambiandolo de la Facultad '.$data['oldFacultad'].' a la Facultad: '.$data['cod_facultad'].'');
			print(true);//datos actualizados correctamente
		}else{
			print(false);//Ya existe un departamento con tal nombre en la nueva facultad
		}
	}else{// si no cambió
		$sql = 'UPDATE departamento 
		SET 
		nombre = "'.$data['nombre'].'",
		estado =  "' . $data['estado'] . '" 
		WHERE cod_departamento =   "' . $data['cod_departamento'] . '"';
		$this->conn->query($sql);
		$this->logg('Edita Departamento '.$data['nombre'].' cambiando su estado a '.$data['estado'].'');
		print(true);//datos actualizados correctamente
	}
}
function imprimir($result){
	$outp = "";//String que convertiremos al formato JSON
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"cod_departamento":"'  . $rs["cod_departamento"] . '",';
		$outp .= '"nombre":"'   . $rs["nombre"]. '",';
		$outp .= '"cod_facultad":"'   . $rs["cod_facultad"]. '",';
		$outp .= '"estado":"'. $rs["estado"]     . '"}'; 
	}
	$outp ='{"records":['.$outp.']}';
	echo($outp);
}
}//Departamento
?>