<?php 
session_start();
if(isset($_POST['token']) && hash_equals($_SESSION['token'], $_POST['token'])){
    require_once '../bd.php';
    $bdd = getBD();

    if(!isset($_SESSION['panier'])){
        $_SESSION['panier'] = [];
    }

    $id = $_POST['art_id'];
    $qte = $_POST['qte'] < 0 ? 0 : $_POST['qte'];
    $a_ajouter = TRUE;

    if ($qte > 0) {
        $rep = $bdd->query('SELECT id_art, quantite FROM Articles WHERE id_art =' .$id);
        $ligne = $rep ->fetch();
        
        foreach ($_SESSION['panier'] as &$article) {
            /* & sert a que les modification faites à $articles 
            marchent également sur $_SESSION['panier'] */
            if ($article[0] === $id && $ligne['id_art'] === $id) {
                $lim = $article[1] + $qte;
                if ($lim > $ligne['quantite']){
                    $article[1] = $ligne['quantite'];
                } else {
                    $article[1] = $lim;
                }
                $a_ajouter = FALSE;
                break;
            }
        }
        if ($a_ajouter && $qte < $ligne['quantite'] ){
            $_SESSION['panier'][] = [$id, $qte];
        } else {
            $_SESSION['panier'][] = [$id, $ligne['quantite']];
        }
        
    }
}    
header("Location: ../index.php");
exit();
?>