<?php 
require_once '../bd.php';
$bdd = getBD();
if(isset($_POST['email'])) {
    $sql = $bdd->prepare("SELECT COUNT(*) FROM Clients WHERE mail = ?");
    $sql->execute([$_POST['email']]);
    $existe = $sql->fetchColumn() > 0;
    echo json_encode(['unique' => !$existe]);
} else {echo json_encode(['unique' => false]);}