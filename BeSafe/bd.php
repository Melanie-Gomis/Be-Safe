<?php
// Connexion à la base de données
function getBD() {
    $dsn = 'mysql:host=localhost;port=8889;dbname=BeSafe;charset=utf8';
    $username = 'root';
    $password = 'root';

    try {
        $bd = new PDO($dsn, $username, $password);
        // Pour gérer les erreurs :
        $bd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $bd;
    } catch (PDOException $e) {
        die("Erreur : " . $e->getMessage());
    }
}
?>
