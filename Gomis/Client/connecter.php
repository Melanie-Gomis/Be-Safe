<?php session_start(); 
function recuperation($mail) {
    require_once '../bd.php';
    $bdd = getBD();
    $sql = $bdd -> prepare('SELECT * FROM Clients WHERE mail = ?');
    $sql -> execute([$mail]);
    
    return $sql->fetch(); //pour recuperer la ligne correspondante
}

if(isset($_POST['mail']) && $_POST['mail'] != "" &&
    isset($_POST['mdp']) && $_POST['mdp'] != "" &&
    isset($_POST['token']) &&
    hash_equals($_SESSION['token'], $_POST['token']))
{

    $client = recuperation($_POST['mail']);

    if(isset($client) && $client != "" && password_verify($_POST['mdp'], $client['mdp'])){
        $_SESSION['client'] = array(
            'id_client' => $client['id_client'],
            'nom' => $client['nom'], 
            'prenom' => $client['prenom'],
            'adresse' => $client['adresse'],
            'numero' => $client['numero'],
            'mail' => $client['mail']
        );
        // echo header("Location: ../index.php");
        // exit(); 
        echo json_encode([
            "succes" => true,
            "message" => "Compte connecter avec succès ! Bienvenue."
        ]);
    } else{
        // header("Location: connexion.php");
        // exit();
        echo json_encode([
            "succes" => false,
            "message" => "L'email et/ou mot de passe incorrect."
        ]);
    }

} else{
    // header("Location: connexion.php");
    // exit();
    echo json_encode([
        "succes" => false,
        "message" => "Problème lors de la connexion."
    ]);
}
?>