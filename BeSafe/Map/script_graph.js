// Récupérer le div "graph"
var graphDiv = document.getElementById('graph');

// Vider le div pour éviter les doublons (au cas où le script est rechargé)
graphDiv.innerHTML = '';

// Créer un canvas et l'ajouter dans le div "graph"
var canvas = document.createElement('canvas');
canvas.id = 'chartCanvas';
graphDiv.appendChild(canvas);

// Initialiser le graphique avec Chart.js
var chart = new Chart(canvas, {
    type: 'bar',
    data: {
        labels: ['Indemnes', 'Blessés légers', 'Hospitalisés', 'Tués'],
        datasets: [{
            label: 'Nombre',
            data: [0, 0, 0, 0], // Initialisation avec des valeurs par défaut
            backgroundColor: ['#4cae4f80', '#2094f380', '#ff9800', '#f44336'],
            borderColor: ['4cae4f','2094f3','ff990080', 'f4403480'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Nombre de personnes selon les blessures'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Nombre de personnes'
                },
                suggestedMax: 10
            },
            x: {
                title: {
                    display: true,
                    text: 'Blessures'
                }
            }
        }
    }
});

// Fonction pour calculer les totaux
function calculateTotals(accidentsList) {
    const totals = { indemne_nb: 0, blesseleger_nb: 0, hospitalise_nb: 0, tue_nb: 0 };

    accidentsList.forEach(accident => {
        totals.indemne_nb += parseInt(accident.indemne_nb) || 0;
        totals.blesseleger_nb += parseInt(accident.blesseleger_nb) || 0;
        totals.hospitalise_nb += parseInt(accident.hospitalise_nb) || 0;
        totals.tue_nb += parseInt(accident.tue_nb) || 0;
    });

    return totals;
}

// Fonction pour mettre à jour le graphique
function updateChart(filteredAccidents = accidents) {
    const totals = calculateTotals(filteredAccidents);

    // Mettre à jour les données du graphique
    chart.data.datasets[0].data = [
        totals.indemne_nb,
        totals.blesseleger_nb,
        totals.hospitalise_nb,
        totals.tue_nb
    ];

    // Ajuster l'échelle si nécessaire
    const maxTotal = Math.max(...chart.data.datasets[0].data);
    chart.options.scales.y.suggestedMax = maxTotal + 5;

    chart.update();
}

// Fonction pour appliquer tous les filtres
function applyFilters() {
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
    //const heure = (filtreHeure === "tout" || accident.heures_minutes >= filtreHeure + ":00" && accident.heures_minutes < (parseInt(filtreHeure) + 1) + ":00");
    const region = document.getElementById('regionFilter').value;
    const departement = document.getElementById('depFilter').value;
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const vehicule = document.getElementById('vehiculeFilter').value;
    const meteo = document.getElementById('meteoFilter').value;
    const luminosite = document.getElementById('lumFilter').value;

    let filteredAccidents = accidents;

    if (annee !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.ANNEE === annee);
    }

    if (mois !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.mois === mois);
    }

    if (jour !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.LIBELLE_JOUR === jour);
    }

    //if (heure !== 'tout') {
        //filteredAccidents = filteredAccidents.filter(accident => accident.heures_minutes === heure);    
    //}
    if (heure !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => {
            const accidentHour = parseInt(accident.heures_minutes.split(':')[0]);
            return accidentHour === parseInt(heure);
        });
    }

    if (region !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.NOM_REG === region);
    }

    if (departement !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.dep === departement);
    }

    if (gravite !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.gravite_accident.toLowerCase() === gravite);
    }

    if (vehicule !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident[vehicule] === '1');
    }

    if (meteo !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.atm === meteo);
    }

    if (luminosite !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.lum === luminosite);
    }

    // Mettre à jour le graphique avec les accidents filtrés
    updateChart(filteredAccidents);
}

// Ajouter des écouteurs d'événements pour chaque filtre
document.getElementById('anneeFilter').addEventListener('change', applyFilters);
document.getElementById('moisFilter').addEventListener('change', applyFilters);
document.getElementById('jourFilter').addEventListener('change', applyFilters);
document.getElementById('heureFilter').addEventListener('change', applyFilters);
document.getElementById('regionFilter').addEventListener('change', applyFilters);
document.getElementById('depFilter').addEventListener('change', applyFilters);
document.getElementById('graviteFilter').addEventListener('change', applyFilters);
document.getElementById('vehiculeFilter').addEventListener('change', applyFilters);
document.getElementById('meteoFilter').addEventListener('change', applyFilters);
document.getElementById('lumFilter').addEventListener('change', applyFilters);

// Mettre à jour le graphique avec les données initiales
updateChart();

console.log('Année sélectionnée:', annee);
console.log('Mois sélectionné:', mois);
console.log('Jour sélectionné:', jour);
console.log('Heure sélectionnée:', heure);
console.log('Région sélectionnée:', region);
console.log('Département sélectionné:', departement);
console.log('Gravité sélectionnée:', gravite);
console.log('Véhicule sélectionné:', vehicule);
console.log('Météo sélectionnée:', meteo);
console.log('Luminosité sélectionnée:', luminosite);
console.log('Accidents filtrés:', filteredAccidents);
