<?php
session_start();
require_once '../bd.php';

$bdd = getBD();
$action = $_POST['action'];

if ($action === "envoie_mess") {
    /* Seul les personne connecter peuvent envoyer des messages 
    mais les autres peuvent regarder */
    if (!isset($_SESSION['client'])) { 
        echo json_encode([
            "succes" => false,
            "mess" => "Veuillez vous connecter."
        ]);
        exit;
    }

    $message = $_POST['message'];
    if (strlen($message) > 256) {
        echo json_encode([
            "succes" => false,
            "mess" =>  "Votre message est trop long."
        ]);
        exit;
    }

    // Charger ScoreMap depuis le fichier JSON
    $scoreMap = json_decode(file_get_contents('ScoreMap.json'), true);

    if ($scoreMap === null) {
        echo json_encode([
            "succes" => false,
            "mess" => "Erreur lors du chargement du fichier ScoreMap.json"
        ]);
        exit;
    }

    // Calculer le score du message
    $score = 0;
    $mots = preg_split('/\s+/', $message);
    $mots = array_unique(array_map('strtolower', $mots));

    foreach ($mots as $mot) {
        if (isset($scoreMap[$mot])) {
            $score += $scoreMap[$mot];
        }
    }

    if ($score < 0) {
        echo json_encode([
            "succes" => false,
            "mess" =>  "Veuillez rester courtois."
        ]);
        exit;
    }

    // Insertion du message
    $stmt = $bdd->prepare("INSERT INTO Discussion (id_client, message, timestamp) VALUES (?, ?, ?)");
    $stmt->execute([$_SESSION['client']['id_client'], $message, time()]);
    echo json_encode(["succes" => true]);

} elseif ($action === "charge_message") {
    // Suppression des messages anciens (plus de 10 minutes)
    $bdd->exec("DELETE FROM Discussion WHERE timestamp <= UNIX_TIMESTAMP() - 600");
    
    // Récupération les messages restant (moins de 10 minutes)
    $stmt = $bdd->query("
        SELECT client.prenom, discu.message
        FROM Discussion AS discu
        JOIN Clients As client ON discu.id_client = client.id_client
        WHERE discu.timestamp > UNIX_TIMESTAMP() - 600
    ");
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($messages);
}
?>
