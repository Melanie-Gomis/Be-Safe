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
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336']
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
    const region = document.getElementById('regionFilter').value;
    const departement = document.getElementById('departementFilter').value;
    const gravite = document.getElementById('graviteFilter').value.toLowerCase();
    const vehicule = document.getElementById('vehiculeFilter').value;
    const meteo = document.getElementById('meteoFilter').value;
    const luminosite = document.getElementById('luminositeFilter').value;

    let filteredAccidents = accidents;

    if (annee !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.annee === annee);
    }

    if (mois !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.mois === mois);
    }

    if (jour !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.jour === jour);
    }

    if (heure !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.heure === heure);
    }

    if (region !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.region === region);
    }

    if (departement !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.departement === departement);
    }

    if (gravite !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.gravite_accident.toLowerCase() === gravite);
    }

    if (vehicule !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident[vehicule] === '1');
    }

    if (meteo !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.meteo === meteo);
    }

    if (luminosite !== 'tout') {
        filteredAccidents = filteredAccidents.filter(accident => accident.luminosite === luminosite);
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
document.getElementById('departementFilter').addEventListener('change', applyFilters);
document.getElementById('graviteFilter').addEventListener('change', applyFilters);
document.getElementById('vehiculeFilter').addEventListener('change', applyFilters);
document.getElementById('meteoFilter').addEventListener('change', applyFilters);
document.getElementById('luminositeFilter').addEventListener('change', applyFilters);

// Mettre à jour le graphique avec les données initiales
updateChart();
