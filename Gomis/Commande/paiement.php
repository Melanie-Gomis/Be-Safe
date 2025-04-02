<?php
session_start();
require_once('../vendor/autoload.php');
require_once('../stripe.php');
require_once('../bd.php');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo 'Invalid request';
    exit;
}

// Vérification contre les attaques par 'POST'
if (!hash_equals($_SESSION['token'], $_POST['token'])) {
    echo 'Invalid CSRF token';
    exit;
}

$bdd = getBD();
$rep = $bdd->query('SELECT id_art, ID_STRIPE FROM Articles');
$articlesStripe = [];
while ($ligne = $rep->fetch()) {
    $articlesStripe[$ligne['id_art']] = $ligne['ID_STRIPE'];
}
$rep->closeCursor();

$rep = $bdd->query('SELECT id_client, ID_STRIPE FROM Clients');
$clientsStripe = [];
while ($ligne = $rep->fetch()) {
    $clientsStripe[$ligne['id_client']] = $ligne['ID_STRIPE'];
}
$rep->closeCursor();

$line_items = [];
foreach ($_SESSION['panier'] as $article) {
    $product_id = $articlesStripe[$article[0]]; // ID du produit
    $price = $stripe->prices->all(['product' => $product_id]); // Récupérer les prix associés au produit

    $line_items[] = [
        'price' => $price->data[0]->id, // Utilise le premier prix trouvé
        'quantity' => $article[1],
    ];
}

$checkout_session = $stripe->checkout->sessions->create([ 
    'customer' => $clientsStripe[$_SESSION['client']['id_client']],
    'success_url' => 'http://localhost:8888/Gomis/Commande/acheter.php',
    'cancel_url' => 'http://localhost:8888/Gomis/Commande/commande.php',
    'mode' => 'payment' ,
    'automatic_tax' => ['enabled' => false], 
    'line_items' => $line_items,
]);

header("HTTP/1.1 303 See Other");
header("Location: " . $checkout_session->url);

?>
