<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
   <head>
      <title> Plantes mortelles</title>
      <link rel="stylesheet" href="Styles/mep.css" type="text/css" media="screen">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
   </head>
   <body>
      <?php 
         // importation avec require pour arrete si mal fait (once pour qu'une seule fois)
         require_once 'bd.php';
         $bdd = getBD();
         $rep = $bdd->query('SELECT * FROM Articles');
      ?>
      <h1>Plantes mortelles</h1>

      <?php if(!isset($_SESSION['client'])){ ?>
         <p> <a href="Client/nouveau.php"> Nouveau Client </a> </p>
         <p> <a href="Client/connexion.php"> Se connecter</a> </p>

      <?php 
         } else{  
            echo '<p> Bonjour '.$_SESSION['client']['prenom'].' '.$_SESSION['client']['nom'].'</p>'; 
      ?>
            <div class="lien"> 
               <a href="Client/deconnexion.php"> Se déconnecter </a>
               <a href="Commande/panier.php"> Panier </a>
               <a href="Commande/historique.php"> Historique des commandes </a>
            </div>
      <?php }?>
         
      <br>
      <table>
         <tr>
            <th>N° identifiant</th>
            <th>Nom</th>
            <th>Stock</th>
            <th>Prix</th>
            <th>Lien</th>
         </tr>
         <?php while ($ligne = $rep ->fetch()) { ?>
            <tr>
               <?php
               echo "<td>".$ligne['id_art']."</td>\n";
               echo "<td>".$ligne['nom']."</td>\n";
               echo "<td>".$ligne['quantite']."</td>\n";
               echo "<td>".$ligne['prix']." €</td>\n";
               echo "<td> <a href = 'Articles/Article.php?id_art=".$ligne['id_art']."'>".$ligne['nom']."</a></td>\n";
               ?>
            </tr>
         <?php } $rep ->closeCursor(); ?>
      </table>
      
      <a href="Contact/contact.html">Contact</a>

      <div id="fenetre_disccussion">
         <div id="messages_passes"></div>
         <div id="chat-input">
               <textarea id="message_rentre" maxlength="256" placeholder="Écrivez un message..."></textarea>
               <button id="message_envoye">Envoyer</button>
         </div>
      </div>
      <script src="Discussion/message.js"></script>
   </body>
</html>