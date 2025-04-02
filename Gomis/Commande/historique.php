<?php session_start() ?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <title> Historique</title>
        <link rel="stylesheet" href="../Styles/mep_comm.css" type="text/css" media="screen">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <?php
        require_once '../bd.php';
        $bdd = getBD();

        $rep_comm = $bdd->query('SELECT * FROM Commandes WHERE id_client ='.$_SESSION['client']['id_client']);
        $rep_art = $bdd->query('SELECT * FROM Articles');

        $articles = [];
        while ($art = $rep_art->fetch()) {
            $articles[$art['id_art']] = $art;
        }

        $commandes = [];
        while ($comm = $rep_comm->fetch()) {
            $num_commande = $comm['num_commande'];
            if (!isset($commandes[$num_commande])) {
                $commandes[$num_commande] = [
                    'articles' => [],
                    'envoi' => $comm['envoi']
                ];
            }
            $commandes[$num_commande]['articles'][] = [
                'id_art' => $comm['id_art'],
                'quantite' => $comm['quantite']
            ];
        }
        ?>

        <h1>Votre historique d'achat</h1><br>
        
        <?php if (!empty($commandes)) { ?>
        <table>
            <tr>
                <th>N° commande</th>
                <th>État de la commande</th>
                <th>N° articles</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Nombre d'exemplaires</th>
            </tr>

            <?php foreach ($commandes as $num_commande => $commande) { 
                echo '<td></td><td></td><td></td><td></td><td></td><td></td>';
                foreach ($commande['articles'] as $index => $article_commande) { ?>
                    <tr>
                        <?php if ($index == 0) { ?>
                            <td rowspan="<?php echo count($commande['articles']); ?>"><?php echo $num_commande; ?></td>
                            <td rowspan="<?php echo count($commande['articles']); ?>"><?php echo $commande['envoi'] == 0 ? 'En attente' : 'Envoyé'; ?></td>
                        <?php } ?>
                        <td><?php echo $article_commande['id_art']; ?></td>
                        <td><?php echo $articles[$article_commande['id_art']]['nom']; ?></td>
                        <td><?php echo $articles[$article_commande['id_art']]['prix']; ?></td>
                        <td><?php echo $article_commande['quantite']; ?></td>
                    </tr>
            <?php } } ?>
        </table>
        
        <?php } else { ?>
        <p> Vous n'avez aucun historique d'achat.</p>
        <?php } ?>

        <a href="../index.php"> Accueil </a>
    </body>
</html>