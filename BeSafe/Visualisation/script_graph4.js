// Mappings des valeurs numériques pour la gravité, luminosité et jours
const graviteMapping = {'blessé léger': 1, 'hospitalisé': 2, 'tué': 3};
const lumMapping = {
    'plein jour': 1,
    'crépuscule ou aube': 2,
    'nuit avec éclairage public allumé': 3,
    'nuit sans éclairage public': 4
};
const joursMapping = {
    'Lundi': 1,
    'Mardi': 2,
    'Mercredi': 3,
    'Jeudi': 4,
    'Vendredi': 5,
    'Samedi': 6,
    'Dimanche': 7
};

// Fonction pour agréger les données
function aggregateData(accidents) {
    return accidents.reduce((acc, accident) => {
        const mois = accident.mois;
        const jourNum = joursMapping[accident.LIBELLE_JOUR];
        const lumNum = lumMapping[accident.lum];
        const graviteNum = graviteMapping[accident.gravite_accident];

        // Créer une clé unique pour la combinaison de variables
        const key = `${mois}-${jourNum}-${lumNum}-${graviteNum}`;

        // Initialiser si la clé n'existe pas
        if (!acc[key]) {
            acc[key] = {
                mois,
                jourNum,
                lumNum,
                graviteNum,
                nombre_accidents: 0
            };
        }

        // Incrémenter le nombre d'accidents pour cette combinaison
        acc[key].nombre_accidents++;

        return acc;
    }, {});
}

// Appliquer les agrégations
const aggregatedData = aggregateData(accidents);

// Transformer en tableau pour l'affichage
const dataForPlot = Object.values(aggregatedData).map(item => ({
    mois: item.mois,
    jourNum: item.jourNum,
    lumNum: item.lumNum,
    graviteNum: item.graviteNum,
    nombre_accidents: item.nombre_accidents,
    size: item.nombre_accidents < 200 ? 10 : item.nombre_accidents < 500 ? 20 : 30 // Taille des points
}));

// Extraire les valeurs pour chaque axe
const moisValues = dataForPlot.map(item => item.mois);
const jourNumValues = dataForPlot.map(item => item.jourNum);
const lumNumValues = dataForPlot.map(item => item.lumNum);
const graviteNumValues = dataForPlot.map(item => item.graviteNum);
const sizeValues = dataForPlot.map(item => item.size);
const nombreAccidentsValues = dataForPlot.map(item => item.nombre_accidents);

// Créer le graphique avec Chart.js
const ctx = document.createElement('canvas');
document.getElementById('graphDiv').appendChild(ctx);

const chart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Accidents',
            data: dataForPlot.map(item => ({
                x: item.mois, // Mois
                y: item.jourNum, // Jour de la semaine
                r: item.size // Taille du point en fonction du nombre d'accidents
            })),
            backgroundColor: dataForPlot.map(item => {
                // Choisir une couleur selon la gravité
                switch (item.graviteNum) {
                    case 1: return '#4cae4f'; // Blessé léger
                    case 2: return '#ff9800'; // Hospitalisé
                    case 3: return '#f44336'; // Tué
                    default: return '#000000';
                }
            }),
            borderColor: '#000000',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Mois'
                },
                ticks: {
                    callback: function(value) {
                        return value.substring(0, 3); // Afficher les 3 premières lettres du mois
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Jour'
                },
                min: 0,
                max: 7,
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        switch (value) {
                            case 1: return 'Lundi';
                            case 2: return 'Mardi';
                            case 3: return 'Mercredi';
                            case 4: return 'Jeudi';
                            case 5: return 'Vendredi';
                            case 6: return 'Samedi';
                            case 7: return 'Dimanche';
                            default: return '';
                        }
                    }
                }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const data = tooltipItem.raw;
                        return `Nombre d'Accidents: ${data.r} | Mois: ${data.x} | Jour: ${data.y}`;
                    }
                }
            }
        }
    }
});