// Initialiser la carte à une position correcte
var map = L.map('map', {
    center: [46.603354, 2.888334], // Centre de la France
    zoom: 5, // Zoom initial
    minZoom: 5, // Zoom minimum
    maxBounds: [ // Limites géographiques (Sud-Ouest, Nord-Est)
        [41.2617, -5.1422], // Sud-Ouest
        [51.1242, 9.6624]   // Nord-Est
    ],
    zoomControl: false // Désactiver les contrôles de zoom par défaut
});

// Ajouter les tuiles OpenStreetMap

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap, © CartoDB'
}).addTo(map);  



// Définir les couleurs par gravité
const graviteCouleurs = {
    "blessé léger": '#2094f380',
    "hospitalisé": '#ff990080',
    "tué": '#f4403480'
};

// Ajouter un groupe de clusters
var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        var n = cluster.getChildCount();
        var couleur = graviteCouleurs["blessé léger"]; // Valeur par défaut

        // Choisir la couleur en fonction du nombre d'accidents dans le cluster
        if (n > 100) {
            couleur = graviteCouleurs["tué"];
        } else if (n <= 100 && n > 5) {
            couleur = graviteCouleurs["hospitalisé"];
        }

        return L.divIcon({
            html: '<div style="background-color:' + couleur + 
                '; color: black; border-radius: 50%; text-align: center; ' + 
                'line-height: 35px; width: 35px; height: 35px; font-size: 12px; ' +
                'border: 1px solid rgba(' + hexToRgb(couleur).r + ',' + hexToRgb(couleur).g + ',' + hexToRgb(couleur).b + ');">' + n + '</div>',
            className: 'marker-cluster',
            iconSize: L.point(30, 30) 
        });
    }
});

// Fonction pour convertir une couleur hexadécimale en RGB
function hexToRgb(hex) {
    var r = parseInt(hex.substr(1, 2), 16);
    var g = parseInt(hex.substr(3, 2), 16);
    var b = parseInt(hex.substr(5, 2), 16);
    return { r: r, g: g, b: b };
}

// Ajouter les marqueurs au cluster
markers.addTo(map);

// Fonction pour ajouter les marqueurs à la carte en fonction des filtres
function ajouterMarkers(filtreGravite, filtreAnnee, filtreMois, filtreJour, filtreHeure, filtreRegion, filtreDep, filtremeteo, filtrelum, filtreVehicule) {
    markers.clearLayers(); // Effacer les marqueurs existants
    accidents.forEach(function(accident) {
        // Vérifier si l'accident correspond aux filtres sélectionnés
        const graviteMatch = (filtreGravite === "tout" || accident.gravite_accident.toLowerCase() === filtreGravite);
        const anneeMatch = (filtreAnnee === "tout" || accident.ANNEE.toString() === filtreAnnee);
        const moisMatch = (filtreMois === "tout" || accident.mois.toString() === filtreMois);
        const jourMatch = (filtreJour === "tout" || accident.LIBELLE_JOUR === filtreJour);
        // Exemple de filtre pour les heures
        const heureDebut = parseInt(filtreHeure, 10); // Convertir le filtre en entier (par ex., "5" devient 5)
        const heureFin = heureDebut + 1;

        // Extraire l'heure de la chaîne "HH:mm"
        const heureAccident = parseInt(accident.heures_minutes.split(':')[0], 10); // "05:30" donne 5

        // Vérification
        const heureMatch = (filtreHeure === "tout" || (heureAccident >= heureDebut && heureAccident < heureFin));
        const regionMatch = (filtreRegion === "tout" || accident.NOM_REG === filtreRegion);
        const depMatch = (filtreDep === "tout" || accident.dep === filtreDep);
        const meteoMatch = (filtremeteo === "tout" || accident.atm === filtremeteo);
        const lumMatch = (filtrelum === "tout" || accident.lum === filtrelum);
        

        // Correction du filtre véhicule
        const vehiculeMatch = (filtreVehicule === "tout" || parseInt(accident[filtreVehicule]) > 0);

        if (graviteMatch && anneeMatch && moisMatch && jourMatch && heureMatch && regionMatch && depMatch && meteoMatch && lumMatch && vehiculeMatch && accident.latitude && accident.longitude) {
            const couleur = graviteCouleurs[accident.gravite_accident] || "gray";

            var marker = L.circleMarker([accident.latitude, accident.longitude], {
                radius: 4,
                color: couleur,
                fillColor: couleur,
                fillOpacity: 0.8,
                weight: 1
            }).bindPopup(`
                <div>
                    <strong> Gravité : ${accident.gravite_accident}</strong><br>
                    Adresse : ${accident.adr || "Non spécifiée"}<br>
                    Date : ${accident.date_formated}<br>
                    Jour : ${accident.LIBELLE_JOUR}<br>
                    Heure : ${accident.heures_minutes}<br>
                </div>
            `);

            markers.addLayer(marker);
        }
    });
    map.addLayer(markers); // Ajouter les marqueurs à la carte
}

// Ajouter les marqueurs au départ (sans filtre)
ajouterMarkers("tout", "tout", "tout", "tout", "tout", "tout", "tout", "tout", "tout", "tout");

// Ajouter un écouteur pour le changement de filtre "Véhicule"
document.getElementById('vehiculeFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value;
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = this.value; // Prendre la valeur du filtre "Véhicule"
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter les marqueurs au départ (sans filtre)
ajouterMarkers("tout", "tout", "tout", "tout", "tout", "tout", "tout", "tout", "tout","tout");

// Ajouter un écouteur pour le changement de gravité
document.getElementById('graviteFilter').addEventListener('change', function() {
    const gravite = this.value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value; // Récupérer la valeur de département
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter un écouteur pour le changement d'année
document.getElementById('anneeFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = this.value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value; // Récupérer la valeur de département
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter un écouteur pour le changement de mois
document.getElementById('moisFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = this.value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value; // Récupérer la valeur de département
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter un écouteur pour le changement de jour
document.getElementById('jourFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = this.value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value; // Récupérer la valeur de département
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter un écouteur pour le changement d'heure
document.getElementById('heureFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = this.value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value; // Récupérer la valeur de département
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter un écouteur pour le changement de région
document.getElementById('regionFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = this.value;
    const dep = document.getElementById('depFilter').value; // Récupérer la valeur de département
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter un écouteur pour le changement de département
document.getElementById('depFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = this.value; // Récupérer la valeur du département
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

// Ajouter un écouteur pour le changement de département
document.getElementById('meteoFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value;
    const meteo = this.value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

document.getElementById('lumFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value;
    const meteo = document.getElementById('meteoFilter').value;
    const lum = this.value; 
    const vehicule = document.getElementById('vehiculeFilter').value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
});

document.getElementById('vehiculeFilter').addEventListener('change', function() {
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    const region = document.getElementById('regionFilter').value;
    const dep = document.getElementById('depFilter').value;
    const meteo = document.getElementById('meteoFilter').value;
    const lum = document.getElementById('lumFilter').value;
    const vehicule = this.value;
    ajouterMarkers(gravite, annee, mois, jour, heure, region, dep, meteo, lum, vehicule); // Appliquer les filtres
})
