<!DOCTYPE html>
<html lang="fr">
    <head>
      <title>Nouveau client</title>
      <link rel="stylesheet" href="../Styles/mep.css" type="text/css" media="screen">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="verification_creation.js"></script>
    </head>
    <body>
        <h1> Créez votre compte </h1>

        <form method ="POST" autocomplete=off>
            <p> 
                <label for="n"> Nom : </label>
                <input type="text" name="n" value="<?php echo isset($_GET['var1']) && $_GET['var1'] != "" ?  $_GET['var1'] :  "" ?>">
            </p>
            <p> 
                <label for="p"> Prénom : </label>
                <input type="text" name="p" value="<?php echo isset($_GET['var2']) && $_GET['var2'] != "" ?  $_GET['var2'] :  "" ?>">
            </p>
            <p> 
                <label for="adr"> Adresse : </label>
                <input type="text" name="adr" value="<?php echo isset($_GET['var3']) && $_GET['var3'] != "" ?  $_GET['var3'] :  "" ?>">
            </p>
            <p> 
                <label for="num"> Numéro de téléphone : </label>
                <input type="text" name="num" value="<?php echo isset($_GET['var4']) && $_GET['var4'] != "" ?  $_GET['var4'] :  "" ?>">
            </p>
            <p> 
                <label for="mail"> Adresse e-mail : </label>
                <input type="text" name="mail" value="<?php echo isset($_GET['var5']) && $_GET['var5'] != "" ?  $_GET['var5'] :  "" ?>">
            </p>
            <p> 
                <label for="mdp1"> Mot de passe : </label>
                <input type="password" name="mdp1" value="">
            </p>
            <p> 
                <label for="mdp2"> Confirmer votre mot de passe : </label>
                <input type="password" name="mdp2" value="">
            </p>
            <!-- <button>Envoyer</button> -->
            <p>
              <input class="ok" type="submit" value="Envoyer">
            </p> 
        </form>
        <div id="info"></div>
    </body>
</html>