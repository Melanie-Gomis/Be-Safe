<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Acheter</title>
    <link rel="stylesheet" href="../Styles/mep_comm.css" type="text/css" media="screen">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
    <?php 

        if (isset($_SESSION['panier']) && !empty($_SESSION['panier']))
        {

            require_once '../bd.php';
            $bdd = getBD();

            $id_client = $_SESSION['client']['id_client'];
            $num_com = $bdd -> query('SELECT MAX(num_commande) FROM Commandes') ->fetchColumn();
            empty($num_com) ? $num_com = 1 : $num_com += 1;

            function enregistrer($bdd, $num_com, $id_art, $id_client, $quantite){
                // enregistrer la commande :
                $sql_commande = $bdd -> prepare ('INSERT INTO Commandes (num_commande, id_art, id_client, quantite) VALUES (?, ?, ?, ?)');
                $sql_commande -> execute([$num_com, $id_art, $id_client, $quantite]);
                
                // mettre à jour la quatite :
                $sql_maj = $bdd -> prepare ('UPDATE Articles SET quantite = quantite - ? WHERE id_art = ?');
                $sql_maj -> execute([$quantite, $id_art]);
            }
            
            $rep = $bdd->query('SELECT id_art, quantite FROM Articles');
            while ($ligne = $rep ->fetch()) {
                foreach ($_SESSION['panier'] as $indice => $article) {
                    if ($article[0] == $ligne['id_art']) {

                        if($article[1] > $ligne['quantite']){
                            $article[1] = $ligne['quantite'];
                        }
                        
                        if($article[1] == 0){
                           unset($_SESSION['panier'][$indice]);
                        }

                        $id_art = $article[0];
                        $quantite = $article[1];
                        
                        enregistrer($bdd, $num_com, $id_art, $id_client, $quantite);
                    }
                }
            }

            unset($_SESSION['panier']); 
        ?>
        <h1> Merci d'avoir passé commande.</h1><br>
        <p>Votre commande a bien été enregistrée. </p><br><br>
    
    <?php } else{ ?>
            <p> Votre panier ne contient aucun article ou un problème est survenue. </p>
    <?php } ?>
    <p><a href="../index.php"> Accueil</a></p>
</body>
</html>