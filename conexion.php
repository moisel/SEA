<?php

/*
*PHP 
*Conexion
*/
//-http://development.seatest.divshot.io
//-http://localhost:9000
//http://ingenieriasoftware.cl/SEA
//header("Access-Control-Allow-Origin: http://ingenieriasoftware.cl/SEA"); // <-con sólo este header funcionaba en chrome

//header("Content-Type: application/json; charset=UTF-8");

//header("Access-Control-Allow-Headers: origin, Content-Type, Accept");

/*header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");*/


header("Access-Control-Allow-Origin: http://www.ingenieriasoftware.cl");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: ACL, CANCELUPLOAD, CHECKIN, CHECKOUT, COPY, DELETE, GET, HEAD, LOCK, MKCALENDAR, MKCOL, MOVE, OPTIONS, POST, PROPFIND, PROPPATCH, PUT, REPORT, SEARCH, UNCHECKOUT, UNLOCK, UPDATE, VERSION-CONTROL");
header("Access-Control-Allow-Headers: Overwrite, Destination, Content-Type, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Location, Lock-Token, If");
header("Access-Control-Expose-Headers: DAV, content-length, Allow");

$host = "localhost";

$user = "marcotor_sea";

$pw = "ang777";

$db = "marcotor_SEA";


$conn = new mysqli($host, $user, $pw, $db);
$acentos = $conn->query("SET NAMES 'utf8'");

?>