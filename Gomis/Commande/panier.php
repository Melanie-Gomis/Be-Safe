<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
   <head>
      <title> Panier</title>
      <link rel="stylesheet" href="../Styles/mep_comm.css" type="text/css" media="screen">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   </head>
   <body>
        <?php
            require_once '../bd.php';
            $bdd = getBD();
            $rep = $bdd->query('SELECT id_art, nom, prix, quantite FROM Articles');
        ?>
        
        <h1> Votre panier</h1>

        <a href="../index.php"> Retour</a>
        
        <?php if (isset($_SESSION['panier']) && !empty($_SESSION['panier'])){ ?>
            <table>
                <tr>
                    <th>N° identifiant</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Nombre d'examplaire</th>
                    <th>Montant total</th>
                </tr>  
        
                <?php while ($ligne = $rep ->fetch()) { ?>
                    <tr>
                        <?php
                        foreach ($_SESSION['panier'] as $indice => $article) {

                            if ($article[0] == $ligne['id_art']) {

                                if($article[1] > $ligne['quantite']){
                                    $article[1] = $ligne['quantite'];
                                }
                                
                                if($article[1] == 0){
                                   unset($_SESSION['panier'][$indice]);
                                } else{
                                    echo "<td>".$ligne['id_art']."</td>\n";
                                    echo "<td>".$ligne['nom']."</td>\n";
                                    echo "<td>".$ligne['prix']." €</td>\n";
                                    echo "<td>".$article[1]."</td>\n";
                                    echo "<td>".$article[1]*$ligne['prix']." €</td>\n";
                                }
                            }
                        }
                        ?>
                    </tr>
                <?php } $rep ->closeCursor(); ?>
            </table>
        <a href="commande.php"> Passer la commande </a>


        <?php } else{ ?>
            <p> Votre panier ne contient aucun article. </p>
        <?php } ?>

        
   </body>
</html>