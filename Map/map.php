<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carte des Accidents</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
    <link rel="stylesheet" href="style_map.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
    <style>
        #map { width: 100%; height: 600px; }
        #filters { margin: 10px; }
        #filters button { margin: 5px; }
    </style>
</head>
<body>

<section id="carte-accidents">
    <h2>Carte interactive des accidents</h2>
    <div id="filters">
        <button onclick="filterMarkers('all')">Tous</button>
        <button onclick="filterMarkers('blesse leger')">Blessé léger</button>
        <button onclick="filterMarkers('hospitalise')">Hospitalisé</button>
        <button onclick="filterMarkers('tue')">Tué</button>
    </div>
    <div id="map"></div>
</section>

<?php
// Connexion à la base de données
$dsn = 'mysql:host=localhost;port=8889;dbname=BeSafe;charset=utf8';
$username = 'root';
$password = 'root';

try {
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Requête SQL pour récupérer les accidents
    $sql = "SELECT Num_Acc AS id, latitude AS lat, longitude AS lon, gravite_accident AS gravite, adr AS adresse, ANNEE as annee FROM accidents";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $accidents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertir les données en JSON
    $json_accidents = json_encode($accidents);

} catch (PDOException $e) {
    die("Erreur : " . $e->getMessage());
}
?>

<script>
    // Initialiser la carte
    var map = L.map('map').setView([50.515, 2.944], 8);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Définir les couleurs par gravité
    const graviteCouleurs = {
        "blesse leger": "blue",
        "hospitalise": "orange",
        "tue": "red"
    };

    // Ajouter un groupe de clusters
    var markers = L.markerClusterGroup();

    // Récupérer les données PHP
    var accidents = <?php echo $json_accidents; ?>;

    // Ajouter les marqueurs colorés sur la carte
    accidents.forEach(function(accident) {
        if (accident.lat && accident.lon) {
            const couleur = graviteCouleurs[accident.gravite] || "gray";

            var marker = L.circleMarker([accident.lat, accident.lon], {
                radius: 4,
                color: couleur,
                fillColor: couleur,
                fillOpacity: 0.8,
                weight: 1
            }).bindPopup(`
                <div>
                    <strong>Accident n°${accident.id}</strong><br>
                    Gravité : ${accident.gravite}<br>
                    Adresse : ${accident.adresse || "Non spécifiée"}<br>
                    Année : ${accident.annee}
                </div>
            `);

            markers.addLayer(marker);
        }
    });

    // Ajouter le groupe de clusters à la carte
    map.addLayer(markers);

    // Fonction de filtrage des marqueurs
    function filterMarkers(gravity) {
        markers.clearLayers();

        accidents.forEach(function(accident) {
            if ((gravity === "all" || accident.gravite === gravity) && accident.lat && accident.lon) {
                const couleur = graviteCouleurs[accident.gravite] || "gray";

                var marker = L.circleMarker([accident.lat, accident.lon], {
                    radius: 4,
                    color: couleur,
                    fillColor: couleur,
                    fillOpacity: 0.8,
                    weight: 1
                }).bindPopup(`
                    <div>
                        <strong>Accident n°${accident.id}</strong><br>
                        Gravité : ${accident.gravite}<br>
                        Adresse : ${accident.adresse || "Non spécifiée"}<br>
                        Année : ${accident.annee}
                    </div>
                `);

                markers.addLayer(marker);
            }
        });

        map.addLayer(markers);
    }
</script>

</body>
</html>