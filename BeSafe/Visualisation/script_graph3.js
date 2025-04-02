// Récupérer le div "graph3"
var graph3Div = document.getElementById('graph3');

// Vider le div pour éviter les doublons (au cas où le script est rechargé)
graph3Div.innerHTML = '';

var canvas3 = document.createElement('canvas');
canvas3.id = 'chartCanvas3';
canvas3.height = 500;
graph3Div.appendChild(canvas3);

// Initialiser le graphique avec Chart.js
var chart3 = new Chart(canvas3, {
    type: 'radar',
    data: {
        labels: ['Voiture', 'Deux roues', 'Vélo', 'Piéton', 'Poids lourd' ],
        datasets: [{
            label: 'Indemnes',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(76, 174, 79, 0.1)',
            borderColor: 'rgba(76, 174, 79, 1)',
            borderWidth: 1
        }, {
            label: 'Blessés légers',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(32, 148, 243, 0.1)',
            borderColor: 'rgba(32, 148, 243, 1)',
            borderWidth: 1
        }, {
            label: 'Hospitalisés',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(255, 153, 0, 0.1)',
            borderColor: 'rgba(255, 153, 0, 1)',
            borderWidth: 1
        }, {
            label: 'Tués',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderColor: 'rgba(244, 67, 54, 1)',
            borderWidth: 1
        }, {
            label: 'Total',
            data: [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
            borderDash: [5, 5]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            title: { display: true, text: 'Nombre de véhicules impliqués par type de blessure' }
        },
        scales: {
            r: { beginAtZero: true, suggestedMax: 10, 
                ticks: { 
                    callback: function(value, index, ticks) {
                    // Calculer l’index médian
                    const midIndex = Math.floor(ticks.length / 2);
                    // Si l'index correspond au tick médian ou au dernier tick, on l'affiche
                    if (index === midIndex || index === ticks.length - 1) {
                        return value;
                    }
                    return '';
                    },
                 }}
        }
    }
});

// Fonction pour calculer les totaux
function calculateTotals3(accidentsList) {
    const totals = {
        voiture: { indemne: 0, blesseleger: 0, hospitalise: 0, tue: 0, total: 0 },
        moto: { indemne: 0, blesseleger: 0, hospitalise: 0, tue: 0, total: 0 },
        velo: { indemne: 0, blesseleger: 0, hospitalise: 0, tue: 0, total: 0 },
        pieton: { indemne: 0, blesseleger: 0, hospitalise: 0, tue: 0, total: 0 },
        autre: { indemne: 0, blesseleger: 0, hospitalise: 0, tue: 0, total: 0 }
    };

    totals.voiture.indemne = accidentsList.filter(accident => accident.has_voiture > 0 && accident.indemne_nb > 0).length;
    totals.voiture.blesseleger = accidentsList.filter(accident => accident.has_voiture > 0 && accident.blesseleger_nb > 0).length;
    totals.voiture.hospitalise = accidentsList.filter(accident => accident.has_voiture > 0 && accident.hospitalise_nb > 0).length;
    totals.voiture.tue = accidentsList.filter(accident => accident.has_voiture > 0 && accident.tue_nb > 0).length;
    totals.voiture.total = accidentsList.filter(accident => accident.has_voiture > 0).length;

    totals.moto.indemne = accidentsList.filter(accident => accident.deuxrouesmotorises_nb > 0 && accident.indemne_nb > 0).length;
    totals.moto.blesseleger = accidentsList.filter(accident => accident.deuxrouesmotorises_nb > 0 && accident.blesseleger_nb > 0).length;
    totals.moto.hospitalise = accidentsList.filter(accident => accident.deuxrouesmotorises_nb > 0 && accident.hospitalise_nb > 0).length;
    totals.moto.tue = accidentsList.filter(accident => accident.deuxrouesmotorises_nb > 0 && accident.tue_nb > 0).length;
    totals.moto.total = accidentsList.filter(accident => accident.deuxrouesmotorises_nb > 0).length;

    totals.velo.indemne = accidentsList.filter(accident => accident.has_velo > 0 && accident.indemne_nb > 0).length;
    totals.velo.blesseleger = accidentsList.filter(accident => accident.has_velo > 0 && accident.blesseleger_nb > 0).length;
    totals.velo.hospitalise = accidentsList.filter(accident => accident.has_velo > 0 && accident.hospitalise_nb > 0).length;
    totals.velo.tue = accidentsList.filter(accident => accident.has_velo > 0 && accident.tue_nb > 0).length;
    totals.velo.total = accidentsList.filter(accident => accident.has_velo > 0).length;

    totals.pieton.indemne = accidentsList.filter(accident => accident.has_pietons > 0 && accident.indemne_nb > 0).length;
    totals.pieton.blesseleger = accidentsList.filter(accident => accident.has_pietons > 0 && accident.blesseleger_nb > 0).length;
    totals.pieton.hospitalise = accidentsList.filter(accident => accident.has_pietons > 0 && accident.hospitalise_nb > 0).length;
    totals.pieton.tue = accidentsList.filter(accident => accident.has_pietons > 0 && accident.tue_nb > 0).length;
    totals.pieton.total = accidentsList.filter(accident => accident.has_pietons > 0).length;

    totals.autre.indemne = accidentsList.filter(accident => accident.has_poidslourd > 0 && accident.indemne_nb > 0).length;
    totals.autre.blesseleger = accidentsList.filter(accident => accident.has_poidslourd > 0 && accident.blesseleger_nb > 0).length;
    totals.autre.hospitalise = accidentsList.filter(accident => accident.has_poidslourd > 0 && accident.hospitalise_nb > 0).length;
    totals.autre.tue = accidentsList.filter(accident => accident.has_poidslourd > 0 && accident.tue_nb > 0).length;
    totals.autre.total = accidentsList.filter(accident => accident.has_poidslourd > 0).length;

    return totals;
}

// Fonction pour mettre à jour le graphique
function updateChart3(filteredAccidents) {
    const totals = calculateTotals3(filteredAccidents);

    chart3.data.datasets[0].data = [
        totals.voiture.indemne,
        totals.moto.indemne,
        totals.velo.indemne,
        totals.pieton.indemne,
        totals.autre.indemne
    ];

    chart3.data.datasets[1].data = [
        totals.voiture.blesseleger,
        totals.moto.blesseleger,
        totals.velo.blesseleger,
        totals.pieton.blesseleger,
        totals.autre.blesseleger
    ];

    chart3.data.datasets[2].data = [
        totals.voiture.hospitalise,
        totals.moto.hospitalise,
        totals.velo.hospitalise,
        totals.pieton.hospitalise,
        totals.autre.hospitalise
    ];

    chart3.data.datasets[3].data = [
        totals.voiture.tue,
        totals.moto.tue,
        totals.velo.tue,
        totals.pieton.tue,
        totals.autre.tue
    ];

    chart3.data.datasets[4].data = [
        totals.voiture.total,
        totals.moto.total,
        totals.velo.total,
        totals.pieton.total,
        totals.autre.total
    ];

    // Calculer le maximum de toutes les branches et arrondir au-dessus
    const maxValue = Math.max(...chart3.data.datasets[4].data);
    chart3.options.scales.r.suggestedMax = Math.ceil(maxValue);

    chart3.update();
}

// Fonction pour appliquer tous les filtres
function applyFilters3() {
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
    updateChart3(filteredAccidents);

}

// Ajouter des écouteurs d'événements pour chaque filtre
document.getElementById('anneeFilter').addEventListener('change', applyFilters3);
document.getElementById('moisFilter').addEventListener('change', applyFilters3);
document.getElementById('jourFilter').addEventListener('change', applyFilters3);
document.getElementById('heureFilter').addEventListener('change', applyFilters3);
document.getElementById('regionFilter').addEventListener('change', applyFilters3);
document.getElementById('depFilter').addEventListener('change', applyFilters3);
document.getElementById('graviteFilter').addEventListener('change', applyFilters3);
document.getElementById('vehiculeFilter').addEventListener('change', applyFilters3);
document.getElementById('meteoFilter').addEventListener('change', applyFilters3);
document.getElementById('lumFilter').addEventListener('change', applyFilters3);

// Appeler applyFilters3() pour initialiser le graphique avec les données initiales
applyFilters3();
