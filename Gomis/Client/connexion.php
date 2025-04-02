<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <title> Connexion </title>
        <link rel="stylesheet" href="../Styles/mep.css" type="text/css" media="screen">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="verification_connexion.js"></script>
    </head>
    <body>
        <h1> Connectez-vous</h1>
        
        <?php  $_SESSION['token'] = bin2hex(random_bytes(32)).bin2hex(random_bytes(32)); ?>

        <form method = "POST" autocomplete = off> 
            <input class="ok" type="hidden" name="token" value="<?php echo $_SESSION['token'];?>">
            <p>
                <label for="mail"> Email :</label>
                <input type="text" name="mail" value="">
            </p>
            <p>
                <label for="mdp"> Mot de passe :</label>
                <input type="password" name="mdp" value="">
            </p>
            <p>
                <input class="ok" type="submit" value="Valider">
            </p> 
        </form>
        <div id="info"></div>
        <a href="nouveau.php"> Nouveau Client </a>

    </body>
</html>