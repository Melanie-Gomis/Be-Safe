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
    "blessé léger": "blue",
    "hospitalisé": "orange",
    "tué": "red"
};

// Ajouter un groupe de clusters
var markers = L.markerClusterGroup();

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
