<?php
class Comision extends SEA {
	function __construct($conn, $token){
		parent::__construct($conn, $token);	
	}
	function ver(){
		if(strcmp($this->token->permiso, 'Administrador')==0){
		$result = $this->conn->query('SELECT * FROM comision');//o mostramos todos
	}else{//o mostramos los que corresponden
		$result = $this->conn->query('SELECT * FROM comision WHERE cod_facultad = "' . $this->token->cod_facultad . '"');
	}
	$this->imprimir($result);

}
function agregarComision($data){
	$result = $this->conn->query('SELECT * FROM comision WHERE anio = "' . $data['anio'] . '" AND cod_facultad = "' . $data['cod_facultad'] . '" ');
	$check = mysqli_num_rows($result);
	if($check === 0 && (strcmp($data['anio'], '')!=0) && (strcmp($data['cod_facultad'], '')!=0)){
		$sql = 'INSERT INTO comision (anio, cod_facultad, rut, decano, miembro1, miembro2, fechaPie, estado) 
		VALUES (
			"' . $data['anio'] . '",
			"' . $data['cod_facultad'] . '",
			"' . $data['rut'] . '",
			"' . $data['decano'] . '",
			"' . $data['miembro1'] . '",
			"' . $data['miembro2'] . '",
			"' . $data['fechaPie'] . '",
			"ACTIVO"
			)';
$this->conn->query($sql);
$this->logg('Ingresa comisión año '.$data['anio'].' facultad '.$data['cod_facultad'].'');
print(true);
}
}

function editarComision($data){
	if(strcmp($data['oldAnio'], $data['anio']) !== 0){//si el usuario cambió el año de la Comisión
		$result = $this->conn->query('SELECT * FROM comision WHERE anio = "' . $data['anio'] . '" AND cod_facultad = "' . $data['cod_facultad'] . '" ');
		$check = mysqli_num_rows($result);
		if($check === 0 && (strcmp($data['anio'], '')!=0)){
			$sql = 'UPDATE comision 
			SET 
			anio = "'.$data['anio'].'",
			rut = "' . $data['rut'] . '",
			decano = "' . $data['decano'] . '",
			miembro1 = "' . $data['miembro1'] . '",
			miembro2 = "' . $data['miembro2'] . '",
			fechaPie = "' . $data['fechaPie'] . '",
			estado = "' . $data['estado'] . '"
			WHERE cod_facultad = "' . $data['cod_facultad'] . '"
			AND anio = "' . $data['oldAnio'] . '"';
			$this->conn->query($sql);
			$this->logg('Configura comisión cambiando del año '.$data['anio'].' al año '.$data['oldAnio'].' de la facultad '.$data['cod_facultad'].'');
			print(true);
		}else{
			print(false);
		}//else
	}else{
		$sql = 'UPDATE comision 
		SET 
		rut = "' . $data['rut'] . '",
		decano = "' . $data['decano'] . '",
		miembro1 = "' . $data['miembro1'] . '",
		miembro2 = "' . $data['miembro2'] . '",
		fechaPie = "' . $data['fechaPie'] . '",
		estado = "' . $data['estado'] . '"
		WHERE cod_facultad = "' . $data['cod_facultad'] . '"
		AND anio = "' . $data['anio'] . '"';
		$this->conn->query($sql);
		$this->logg('Configura comisión del año '.$data['anio'].' de la facultad '.$data['cod_facultad'].'');
		print(true);
	}//else
}

function comisionesActivas($cod_facultad){
	$result = $this->conn->query('SELECT * FROM comision WHERE estado = "ACTIVO" AND cod_facultad = "' . $cod_facultad . '"');
	$this->imprimir($result);
	

}
function imprimir($result){
	$outp = "";//String que convertiremos al formato JSON
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"anio":"'  . $rs["anio"] . '",';
		$outp .= '"cod_facultad":"'   . $rs["cod_facultad"] . '",';
		$outp .= '"rut":"'   . $rs["rut"] . '",';
		$outp .= '"decano":"'   . $rs["decano"] . '",';
		$outp .= '"miembro1":"'   . $rs["miembro1"] . '",';
		$outp .= '"miembro2":"'   . $rs["miembro2"] . '",';
		$outp .= '"fechaPie":"'   . $rs["fechaPie"] . '",';
		$outp .= '"estado":"'   . $rs["estado"] . '"}'; 
	}

	$outp ='{"records":['.$outp.']}';
	echo($outp);
}
}//Comision
?> 