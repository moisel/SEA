<?php
/*
*SEA
*METODOS
*/
include("jwt.php");
$strReg = '/^[a-zA-Z ñáéíóúÑÁÉÍÓÚ]*$/';
$strReg2 = '/^[a-zA-Z ñáéíóúÑÁÉÍÓÚ\.]*$/';
$strNum = '/^[0-9]*$/';
$strNum2 = '/^[0-9\.]*$/';
$strEst = '(ACTIVO|INACTIVO)';
$strRut = '/^[0-9kK\.-]*$/';
$strComp = '/^[a-zA-Z0-9]*$/';
function validar($string, $regexp){//función que valida un dato, retornándolo si sirve
		//ejemplo de regexp: "/^[a-zA-Z]*$/" (todas las letras mayúsculas y minusculas)
	 	if (preg_match($regexp, $string)){
	      return $string;
	    }else{
	    	return false;
	    }
}//validar
function validarEmail($email){//validador especial
	if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
  		return $email; 
	}else{
		return false;
	}
}
function validarRut($rut){
	$suma=0;
    if(strpos($rut,"-")==false){
        $RUT[0] = substr($rut, 0, -1);
        $RUT[1] = substr($rut, -1);
    }else{
        $RUT = explode("-", trim($rut));
    }
    $elRut = str_replace(".", "", trim($RUT[0]));
    $factor = 2;
    for($i = strlen($elRut)-1; $i >= 0; $i--):
        $factor = $factor > 7 ? 2 : $factor;
        $suma += $elRut{$i}*$factor++;
    endfor;
    $resto = $suma % 11;
    $dv = 11 - $resto;
    if($dv == 11){
        $dv=0;
    }else if($dv == 10){
        $dv="k";
    }else{
        $dv=$dv;
    }
   if($dv == trim(strtolower($RUT[1]))){
       return $rut;//retornamos el rut, para que pueda ser usado en caso de ser válido
   }else{
       return false;
   }
}//validarRut

class SEA{
	protected $conn;//protected para ser accedidos desde la clase que los hereda
	protected $token;
	function __construct($conn, $token){
		$this->conn = $conn;
		$this->token = $this->traerToken($token);	
	}
	function traerToken($userToken){
		if ($userToken!=null) {
			$token = JWT::decode($userToken, 'gr874AD84984reg_rfe687687rgAJHLI65484KHJ56465_4365RGsdg3r4g6er48g3zz');
			if ($token->permiso && $token->nombre && $token->apellidos &&
			 $token->email && $token->cod_facultad && $token->time) {//si trae todos los componentes del token
				$hourdiff = round((strtotime(date('Y-m-d H:i:s')) - strtotime($token->time))/3600, 1);
				if ($hourdiff>=5) {//si el token fue generado hace mas de 5 horas, este se descompone
					return false;
				}else{
					return $token;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
	}//fin traerToken
	function permiso(){
		return $this->token->permiso;
	}
	function nombre(){
		return $this->token->nombre;
	}
	function facultad(){
		return $this->token->cod_facultad;
	}
	function logg($msg){//no arrojar carácteres inválidos
		//$this->logg($msg);
		if($msg){
		$sql = 'INSERT INTO log (mensaje, usuario, fecha) 
				VALUES (
					"' . $msg . '",
					"' . $this->token->email . '",
					"'.date("Y-m-d H:i:s").'"
					)';
				$this->conn->query($sql);
		}//if($msg)
	}
	
}//SEA
?>
