<?php session_start(); ?>
<!DOCTYPE html>
    <html lang="fr">
    <head>
        <title> Commande</title>
        <link rel="stylesheet" href="../Styles/mep_comm.css" type="text/css" media="screen">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        
        <?php
        require_once '../bd.php';
        $bdd = getBD();
        $rep = $bdd->query('SELECT id_art, nom, prix, quantite FROM Articles');
        ?>

        <?php if (isset($_SESSION['panier']) && !empty($_SESSION['panier'])){ ?>

        
            <h1>Passer la commande</h1>
            <p>Récapitulatif de votre commande :</p><br>

            <table>
                <tr>
                    <th>N° identifiant</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Nombre d'examplaire</th>
                    <th>Montant total</th>
                </tr>  

                <?php  
                $montant_tot = 0;
                while ($ligne = $rep ->fetch()) { 
                ?>
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
                                $montant_tot += $article[1]*$ligne['prix'];
                                }
                            }
                        }
                        ?>
                    </tr>
                <?php } $rep ->closeCursor(); ?>
            </table>
            
            <?php echo '<br><p>Montant de votre commande : '.$montant_tot.'€</p><br>'; ?>
            
            <p> La commande sera expédiée à l’adresse suivante : </p>
            
            <?php 
            $ali = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
            echo '<p>'.$ali.$_SESSION['client']['nom'].' '.
                $_SESSION['client']['prenom'].'<br>'.$ali.
                $_SESSION['client']['adresse'].'</p>' ; 
            ?>
            
            <?php  $_SESSION['token'] =  bin2hex(random_bytes(32)).bin2hex(random_bytes(32)); ?>

            <form action="paiement.php" method="POST" autocomplete=off>
                <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>">
                <input type="submit" value="Valider">
            </form>

        <?php } else{ ?>
            <p> Votre panier ne contient aucun article. </p>
        <?php } ?>
        
        <a href="../index.php"> Retour</a>

    </body>
</html>