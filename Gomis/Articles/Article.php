<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <title>Articles</title>
        <link rel="stylesheet" href="../Styles/mep_art.css" type="text/css" media="screen">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <?php
        require_once '../bd.php';
        $id = $_GET['id_art'];
        
        $bdd = getBD();
        $rep = $bdd->query('SELECT * from Articles WHERE id_art = '.$id);
        $ligne = $rep ->fetch();

        echo 
        "<h1>".$ligne['nom']."</h1>
        <ul>
            <li><img src='".$ligne['url_photo']."' alt='Photo'></li>
            <li>".$ligne['description']."</li>
        </ul>";
    
        if(isset($_SESSION['client'])){ 
            if($ligne['quantite'] == 0 ){
                echo '<p> Cet article est en rupture de stock.</p>';
            } else {
                $_SESSION['token'] = bin2hex(random_bytes(32)).bin2hex(random_bytes(32)); ?>
  
                <form action="../Commande/ajouter.php" method="POST" autocomplete=off>
                    
                    <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>">
                    <input type="hidden" name="art_id" value="<?php echo  $id; ?>">

                    <input type="number" name="qte" id="" value="1" min="1" max="<?php echo $ligne['quantite']; ?>" required>
                    <!-- required pour obliger une quantite et min pour obliger une donnee valide-->

                    <input type="submit" value="Ajoutez à votre panier">
                </form>       
        <?php } } ?>
        <a href="../index.php"> Accueil</a>
    </body>
</html>