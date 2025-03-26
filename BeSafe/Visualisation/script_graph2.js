// Récupérer le div "graph2"
var graph2Div = document.getElementById('graph2');

// Vider le div pour éviter les doublons (au cas où le script est rechargé)
graph2Div.innerHTML = '';

// Créer un canvas et l'ajouter dans le div "graph2"
var canvas2 = document.createElement('canvas');
canvas2.id = 'chartCanvas2';
graph2Div.appendChild(canvas2);

// Fonction pour formater les mois en toutes lettres
function formatMonth2(value) {
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[value - 1];
}

// Initialiser le graphique avec Chart.js
var chart2 = new Chart(canvas2, {
    type: 'scatter',
    data: {
        datasets: [
            {
                label: 'Indemnes',
                data: [],
                backgroundColor: '#4cae4f80',
                borderColor: '#4cae4f',
                borderWidth: 1
            },
            {
                label: 'Blessés légers',
                data: [],
                backgroundColor: '#2094f380',
                borderColor: '#2094f3',
                borderWidth: 1
            },
            {
                label: 'Hospitalisés',
                data: [],
                backgroundColor: '#ff990080',
                borderColor: '#ff9800',
                borderWidth: 1
            },
            {
                label: 'Tués',
                data: [],
                backgroundColor: '#f4403480',
                borderColor: '#f44336',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: {
                display: true,
                text: 'Nombre de personnes touchées par mois'
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
                    text: 'Mois'
                },
                type: 'linear',
                position: 'bottom',
                ticks: {
                    callback: formatMonth2,
                    stepSize: 1, // Forcer l'affichage de toutes les étiquettes
                    max: 12, // Limiter l'axe des x à 12 mois
                    min: 1 // Commencer l'axe des x à 1
                },
                offset: true, // Activer le décalage
                padding: {
                    left: 10, // Décalage à gauche pour janvier
                    right: 0
                }
            }
        }
    }
});

// Fonction pour calculer les totaux par mois et gravité
function calculateTotalsByMonth2(accidentsList) {
    const totals = {
        indemne: Array(12).fill(0),
        blesseleger: Array(12).fill(0),
        hospitalise: Array(12).fill(0),
        tue: Array(12).fill(0)
    };

    accidentsList.forEach(accident => {
        const month = parseInt(accident.mois) - 1; // Convertir le mois en index (0-11)
        totals.indemne[month] += parseInt(accident.indemne_nb) || 0;
        totals.blesseleger[month] += parseInt(accident.blesseleger_nb) || 0;
        totals.hospitalise[month] += parseInt(accident.hospitalise_nb) || 0;
        totals.tue[month] += parseInt(accident.tue_nb) || 0;
    });

    return totals;
}

// Fonction pour mettre à jour le graphique
function updateChart2(filteredAccidents = accidents) {
    const totals = calculateTotalsByMonth2(filteredAccidents);

    // Mettre à jour les données du graphique
    chart2.data.datasets[0].data = totals.indemne.map((count, index) => ({ x: index + 1, y: count }));
    chart2.data.datasets[1].data = totals.blesseleger.map((count, index) => ({ x: index + 1, y: count }));
    chart2.data.datasets[2].data = totals.hospitalise.map((count, index) => ({ x: index + 1, y: count }));
    chart2.data.datasets[3].data = totals.tue.map((count, index) => ({ x: index + 1, y: count }));

    // Ajuster l'échelle si nécessaire
    const maxTotal = Math.max(...totals.indemne, ...totals.blesseleger, ...totals.hospitalise, ...totals.tue);
    chart2.options.scales.y.suggestedMax = maxTotal + 5;

    chart2.update();
}

// Fonction pour appliquer tous les filtres
function applyFilters2() {
    const annee = document.getElementById('anneeFilter').value;
    const mois = document.getElementById('moisFilter').value;
    const jour = document.getElementById('jourFilter').value;
    const heure = document.getElementById('heureFilter').value;
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
    updateChart2(filteredAccidents);
}

// Ajouter des écouteurs d'événements pour chaque filtre
document.getElementById('anneeFilter').addEventListener('change', applyFilters2);
document.getElementById('moisFilter').addEventListener('change', applyFilters2);
document.getElementById('jourFilter').addEventListener('change', applyFilters2);
document.getElementById('heureFilter').addEventListener('change', applyFilters2);
document.getElementById('regionFilter').addEventListener('change', applyFilters2);
document.getElementById('depFilter').addEventListener('change', applyFilters2);
document.getElementById('graviteFilter').addEventListener('change', applyFilters2);
document.getElementById('vehiculeFilter').addEventListener('change', applyFilters2);
document.getElementById('meteoFilter').addEventListener('change', applyFilters2);
document.getElementById('lumFilter').addEventListener('change', applyFilters2);

// Mettre à jour le graphique avec les données initiales
updateChart2();
