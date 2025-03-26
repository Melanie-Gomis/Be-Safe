<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualisation d'accidents</title>
    <link rel="stylesheet" href="../styles/visu.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1"></script>
</head>
<body>
    <?php
    require_once "../bd.php"; // Inclut le fichier contenant la fonction getBD()

    try {
        // Obtenir la connexion à la base de données
        $bd = getBD();

        // Requête SQL pour récupérer les accidents
        $sql = "SELECT * FROM accidents";
        $stmt = $bd->prepare($sql);
        $stmt->execute();
        $accidents = $stmt->fetchAll(PDO::FETCH_ASSOC); // tableau interactif
        // Convertir les données en JSON pour faciliter les échanges
        $json_accidents = json_encode($accidents);
        
    } catch (PDOException $e) {
        die("Erreur : " . $e->getMessage());
    }
    ?>

    <header>
        <img src="../Images/logo.png" alt="Be Safe Logo">
        <h1>Be safe : Visualisation des accidents</h1>
    </header>

    <main>
        <aside id="filtres">
            <h2>Filtres</h2>
            <form>
                <label for="anneeFilter">Année :</label>
                <select id="anneeFilter">
                    <option value="tout">Tout</option>
                    <option value="2005">2005</option>
                    <option value="2010">2010</option>
                    <option value="2015">2015</option>
                </select>

                <label for="moisFilter">Mois :</label>
                <select id="moisFilter">
                    <option value="tout">Tout</option>
                    <option value="1">Janvier</option>
                    <option value="2">Février</option>
                    <option value="3">Mars</option>
                    <option value="4">Avril</option>
                    <option value="5">Mai</option>
                    <option value="6">Juin</option>
                    <option value="7">Juillet</option>
                    <option value="8">Août</option>
                    <option value="9">Septembre</option>
                    <option value="10">Octobre</option>
                    <option value="11">Novembre</option>
                    <option value="12">Décembre</option>
                </select>

                <label for="jourFilter">Jour de la semaine :</label>
                <select id="jourFilter">
                    <option value="tout">Tout</option>
                    <option value="Lundi">Lundi</option>
                    <option value="Mardi">Mardi</option>
                    <option value="Mercredi">Mercredi</option>
                    <option value="Jeudi">Jeudi</option>
                    <option value="Vendredi">Vendredi</option>
                    <option value="Samedi">Samedi</option>
                    <option value="Dimanche">Dimanche</option>
                </select>

                <label for="heureFilter">Heure :</label>
                <select id="heureFilter">
                    <option value="tout">Tout</option>
                    <option value="00">00:00</option>
                    <option value="01">01:00</option>
                    <option value="02">02:00</option>
                    <option value="03">03:00</option>
                    <option value="04">04:00</option>
                    <option value="05">05:00</option>
                    <option value="06">06:00</option>
                    <option value="07">07:00</option>
                    <option value="08">08:00</option>
                    <option value="09">09:00</option>
                    <option value="10">10:00</option>
                    <option value="11">11:00</option>
                    <option value="12">12:00</option>
                    <option value="13">13:00</option>
                    <option value="14">14:00</option>
                    <option value="15">15:00</option>
                    <option value="16">16:00</option>
                    <option value="17">17:00</option>
                    <option value="18">18:00</option>
                    <option value="19">19:00</option>
                    <option value="20">20:00</option>
                    <option value="21">21:00</option>
                    <option value="22">22:00</option>
                    <option value="23">23:00</option>
                </select>

                <label for="regionFilter">Région :</label>
                <select id="regionFilter">
                    <option value="tout">Tout</option>
                    <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                    <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
                    <option value="Bretagne">Bretagne</option>
                    <option value="Centre-Val de Loire">Centre-Val de Loire</option>
                    <option value="Corse">Corse</option>
                    <option value="Grand Est">Grand Est</option>
                    <option value="Hauts-de-France">Hauts-de-France</option>
                    <option value="Île-de-France">Île-de-France</option>
                    <option value="Normandie">Normandie</option>
                    <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                    <option value="Occitanie">Occitanie</option>
                    <option value="Pays de la Loire">Pays de la Loire</option>
                    <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
                </select>

                <label for="depFilter">Département :</label>
                <select id="depFilter">
                    <option value="tout">Tout</option>
                    <option value="01">Ain</option>
                    <option value="02">Aisne</option>
                    <option value="03">Allier</option>
                    <option value="04">Alpes-de-Haute-Provence</option>
                    <option value="05">Hautes-Alpes</option>
                    <option value="06">Alpes-Maritimes</option>
                    <option value="07">Ardèche</option>
                    <option value="08">Ardennes</option>
                    <option value="09">Ariège</option>
                    <option value="10">Aube</option>
                    <option value="11">Aude</option>
                    <option value="12">Aveyron</option>
                    <option value="13">Bouches-du-Rhône</option>
                    <option value="14">Calvados</option>
                    <option value="15">Cantal</option>
                    <option value="16">Charente</option>
                    <option value="17">Charente-Maritime</option>
                    <option value="18">Cher</option>
                    <option value="19">Corrèze</option>
                    <option value="21">Côte-d'Or</option>
                    <option value="22">Côtes-d'Armor</option>
                    <option value="23">Creuse</option>
                    <option value="24">Dordogne</option>
                    <option value="25">Doubs</option>
                    <option value="26">Drôme</option>
                    <option value="27">Eure</option>
                    <option value="28">Eure-et-Loir</option>
                    <option value="29">Finistère</option>
                    <option value="30">Gard</option>
                    <option value="31">Haute-Garonne</option>
                    <option value="32">Gers</option>
                    <option value="33">Gironde</option>
                    <option value="34">Hérault</option>
                    <option value="35">Ille-et-Vilaine</option>
                    <option value="36">Indre</option>
                    <option value="37">Indre-et-Loire</option>
                    <option value="38">Isère</option>
                    <option value="39">Jura</option>
                    <option value="40">Landes</option>
                    <option value="41">Loir-et-Cher</option>
                    <option value="42">Loire</option>
                    <option value="43">Haute-Loire</option>
                    <option value="44">Loire-Atlantique</option>
                    <option value="45">Loiret</option>
                    <option value="46">Lot</option>
                    <option value="47">Lot-et-Garonne</option>
                    <option value="48">Lozère</option>
                    <option value="49">Maine-et-Loire</option>
                    <option value="50">Manche</option>
                    <option value="51">Marne</option>
                    <option value="52">Haute-Marne</option>
                    <option value="53">Mayenne</option>
                    <option value="54">Meurthe-et-Moselle</option>
                    <option value="55">Meuse</option>
                    <option value="56">Morbihan</option>
                    <option value="57">Moselle</option>
                    <option value="58">Nièvre</option>
                    <option value="59">Nord</option>
                    <option value="60">Oise</option>
                    <option value="61">Orne</option>
                    <option value="62">Pas-de-Calais</option>
                    <option value="63">Puy-de-Dôme</option>
                    <option value="64">Pyrénées-Atlantiques</option>
                    <option value="65">Hautes-Pyrénées</option>
                    <option value="66">Pyrénées-Orientales</option>
                    <option value="67">Bas-Rhin</option>
                    <option value="68">Haut-Rhin</option>
                    <option value="69">Rhône</option>
                    <option value="70">Haute-Saône</option>
                    <option value="71">Saône-et-Loire</option>
                    <option value="72">Sarthe</option>
                    <option value="73">Savoie</option>
                    <option value="74">Haute-Savoie</option>
                    <option value="75">Paris</option>
                    <option value="76">Seine-Maritime</option>
                    <option value="77">Seine-et-Marne</option>
                    <option value="78">Yvelines</option>
                    <option value="79">Deux-Sèvres</option>
                    <option value="80">Somme</option>
                    <option value="81">Tarn</option>
                    <option value="82">Tarn-et-Garonne</option>
                    <option value="83">Var</option>
                    <option value="84">Vaucluse</option>
                    <option value="85">Vendée</option>
                    <option value="86">Vienne</option>
                    <option value="87">Haute-Vienne</option>
                    <option value="88">Vosges</option>
                    <option value="89">Yonne</option>
                    <option value="90">Territoire de Belfort</option>
                    <option value="91">Essonne</option>
                    <option value="92">Hauts-de-Seine</option>
                    <option value="93">Seine-Saint-Denis</option>
                    <option value="94">Val-de-Marne</option>
                    <option value="95">Val-d'Oise</option>
                </select>

                <label for="graviteFilter">Gravité :</label>
                <select id="graviteFilter">
                    <option value="tout">Tout</option>
                    <option value="blessé léger">Faible</option>
                    <option value="hospitalisé">Moyenne</option>
                    <option value="tué">Forte</option>
                </select>

                <label for="vehiculeFilter">Type de véhicule :</label>
                <select id="vehiculeFilter">
                    <option value="tout">Tout</option>
                    <option value="has_voiture">Voiture</option>
                    <option value="has_velo">Vélo</option>
                    <option value="deuxrouesmotorises_nb">Deux roues motorisés</option>
                    <option value="has_pietons">Piétons</option>
                    <option value="has_poidslourd">Poids lourd</option>
                </select>

                <label for="meteoFilter">Météo :</label>
                <select id="meteoFilter">
                    <option value="tout">Tout</option>
                    <option value="autre météo">Autre météo</option>
                    <option value="brouillard - fumée">Brouillard - Fumée</option>
                    <option value="météo normale">Météo normale</option>
                    <option value="neige - grêle">Neige - Grêle</option>
                    <option value="pluie forte">Pluie forte</option>
                    <option value="pluie légère">Pluie légère</option>
                    <option value="temps couvert">Temps couvert</option>
                    <option value="temps éblouissant">Temps éblouissant</option>
                    <option value="vent fort - tempête">Vent fort - Tempête</option>
                </select>

                <label for="lumFilter">Luminosité :</label>
                <select id="lumFilter">
                    <option value="tout">Tout</option>
                    <option value="crépuscule ou aube">Crépuscule ou aube</option>
                    <option value="nuit avec éclairage public allumé">Nuit avec éclairage public allumé</option>
                    <option value="nuit avec éclairage public non allumé">Nuit avec éclairage public éteint</option>
                    <option value="nuit sans éclairage public">Nuit sans éclairage public</option>
                    <option value="plein jour">Plein jour</option>
                </select>
            </form>
            <a id ="lien" href="../index.html">Retour à l'accueil</a>
        </aside>

        <section id="content">
            <h2>Carte interactive des accidents</h2>
            <div id="carte">
                <div id="map"></div>
                <div id="legende">
                    <h2>Légende :</h2>
                    <ul>
                        <li><span class="marker" style="background-color: #2094f380; border-color: #2094f3;"></span> Gravité faible </li>
                        <li><span class="marker" style="background-color: #ff990080; border-color: #ff9800;"></span> Gravité moyenne </li>
                        <li><span class="marker" style="background-color: #f4403480; border-color: #f44336;"></span> Gravité forte </li>
                    </ul>
                </div>
            </div>

            <h2>Graphique des statistiques</h2>
            <div id="graph"></div>
            <div id="graph2"></div>
            <div id="graph3"></div>

            <script> var accidents = <?php echo $json_accidents; ?>; </script>
            <script src="script_map.js"></script>
            <script src="script_graph.js"></script>
            <script src="script_graph2.js"></script>
            <script src="script_graph3.js"></script>
        </section>
    </main>

    <footer>
        <p>© 2024-2025 Be Safe — Université Paul Valéry — Montpellier</p>
    </footer>
</body>
</html>
