<?php 
    function getBD() {
        $bdd = new PDO('mysql:host=localhost;dbname=Plantes mortelles;charset=utf8', 'root', 'root'); 
        return $bdd;
    }
?>