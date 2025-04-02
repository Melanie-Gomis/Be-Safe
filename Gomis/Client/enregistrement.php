<?php 
function email_unique($mail) {
    require_once '../bd.php';
    $bdd = getBD();
    
    $sql = $bdd->prepare("SELECT COUNT(*) FROM Clients WHERE mail = ?");
    $sql->execute([$mail]);
    return $sql->fetchColumn() !== 0; // Renvoie false si l'email existe, sinon true
}

function enregistrer_bd($n, $p, $adr, $num, $mail, $mdp , $stripe_id) {
    require_once '../bd.php';
    $bdd = getBD();
    // pour eviter les attaques par injections SQL
    $sql = $bdd -> prepare ("INSERT INTO Clients (nom, prenom, adresse, numero, mail, mdp, ID_STRIPE) VALUES (?, ?, ?, ?, ?, ?, ?)");
    // chiffrer le mdp pour la sécurité
    $mdp = password_hash($mdp, PASSWORD_DEFAULT); //PASSWORD_DEFAULT =SHA1 HASH
    //executer la requettes avec les valeurs
    $sql -> execute([$n, $p, $adr, $num, $mail, $mdp, $stripe_id]);
}

function enregistrer_stripe($n, $p, $mail){
    require_once('../vendor/autoload.php');
    require_once('../stripe.php');

    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        echo json_encode([
            "succes" => false,
            "message" => "Invalid request."
        ]);
        exit;
    }

    $customer = $stripe->customers->create([
        'name' => $p . ' ' . $n,
        'email' => $mail,
    ]);

    return $customer->id;
}

if(isset($_POST['n']) && $_POST['n'] != "" &&
    isset($_POST['p']) && $_POST['p'] != "" &&
    isset($_POST['adr']) && $_POST['adr'] != "" &&
    isset($_POST['num']) && $_POST['num'] != "" &&
    isset($_POST['mail']) && $_POST['mail'] != "" &&
    isset($_POST['mdp1']) && $_POST['mdp1'] != "" && 
    isset($_POST['mdp2']) && $_POST['mdp2'] != "" &&
    $_POST['mdp1'] === $_POST['mdp2'] &&
    email_unique($_POST['mail']))
{
    // enregistre le client dans stripe
    $stripe_id = enregistrer_stripe($_POST['n'], $_POST['p'], $_POST['mail']);
    
    // enregistre le client dans la BD
    enregistrer_bd($_POST['n'], $_POST['p'], $_POST['adr'], $_POST['num'], $_POST['mail'], $_POST['mdp1'], $stripe_id);
    /* 
        // redirige vers index.php:
        header("Location: ../index.php"); // remplace :  echo '<meta http-equiv="refresh" content="0; url=../index.php">';
        exit(); // par securite 
    */
    
    // Retourne une réponse JSON de succès
    echo json_encode([
        "succes" => true,
        "message" => "Compte créé avec succès ! Bienvenue."
    ]);
} else{
    /* 
        // récupération des variables
        // condition ? valeur_vrai : valeur_faux
        isset($_POST['n'])&& $_POST['n'] != "" ? $var1 = $_POST['n'] : $var1 ="";
        isset($_POST['p'])&& $_POST['p'] != "" ? $var2 = $_POST['p'] : $var12 ="";
        isset($_POST['adr'])&& $_POST['adr'] != "" ? $var3 = $_POST['adr'] : $var3 ="";
        isset($_POST['num'])&& $_POST['num'] != "" ? $var4 = $_POST['num'] : $var4 ="";
        isset($_POST['mail'])&& $_POST['mail'] != "" ? $var5 = $_POST['mail'] : $var5 ="";

        // redirige vers nouveau.php
        header("Location: nouveau.php?".
        'var1=' . $var1 . '&' .
        'var2=' . $var2 . '&' .
        'var3=' . $var3 . '&' .
        'var4=' . $var4 . '&' .
        'var5=' . $var5);
        exit();
    */

    // Retourne une réponse JSON d'echec
    echo json_encode([
        "succes" => false,
        "message" => "Problème lors de la création du compte."
    ]);
    
}
?>