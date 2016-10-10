<?php
/*
*PHP
*Evidencias
*Metodos
*/
class Evidencia extends SEA {

    function __construct($conn, $token){
        parent::__construct($conn, $token); 
    }
function upload($data){
	$target_dir = "uploads/".$data['cod_facultad']."/";//lo guardamos en la carpeta que corresponde
	$target_file = $target_dir . basename($data['inicioPeriodo'] . ".pdf");//png a cambiar mas a delante

	if (!file_exists($target_dir)) {//si no existe la ruta
	    mkdir($target_dir, 0777, true);//la creamos
	}
    $mensaje = '"El archivo se ha subido con éxito"';
    try{
	   move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);//guardamos el archivo
    }catch(Exception $e){
        $mensaje = '"Error al subir el archivo"';
    }
    echo $mensaje;
}

function download($data){

//$archivo = basename($data['inicioPeriodo'] . $data['finPeriodo'] . ".png");
$archivo = $data['inicioPeriodo'].".pdf";
$ruta = "uploads/".$data['cod_facultad']."/";
$fullRuta = $ruta . $archivo;
if (is_file($fullRuta)){

header('Content-Type: application/force-download');
header('Content-Disposition: attachment; filename='.$archivo);
header('Content-Transfer-Encoding: binary');
header('Content-Length: '.filesize($fullRuta));

readfile($fullRuta);
}else{
    echo"No existe archivos para este período";
}

}

}//Evidencia
?>