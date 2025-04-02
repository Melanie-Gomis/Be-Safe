
// Pour les alert : avertissement
function avertissement(message){
    // Récupérer le div de l'avertissement et le fond
    let avertissementDiv = document.getElementById('avertissement');
    let overlayDiv = document.getElementById('overlay');

    avertissementDiv.textContent = message;
    avertissementDiv.style.display = 'block';
    overlayDiv.style.display = 'block';
    
    overlayDiv.addEventListener('click', function() {
        avertissementDiv.style.display = 'none';
        overlayDiv.style.display = 'none';
    });
}

// Ajoute un écouteur d'événement pour la soumission du formulaire
document.getElementById("accident-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    
    function select_valide(champs){
        if (champs=== "") {
            return false;
        }
        return true;
    }

    function input_valide(champs){
        
        let num = parseInt(champs)
        if (Number.isInteger (num)) {
            if (!isNaN(num) && num >= 2000 && num <= 9999) {
                return true;
            }
        }
        return false;
    }
    
    // Sélectionner les champs du formulaire
    const annee = document.getElementById("anneeFilter").value;
    const mois = document.getElementById("moisFilter").value;
    const dep = document.getElementById("depFilter").value;


    // Vérification des champs
    if (!select_valide(mois) || !select_valide(dep)) {
        avertissement("Merci de remplir tous les champs.");
        return;
    }

    if (!input_valide(annee)){
        avertissement("Merci de mettre un entier entre 2000 et 9999.");
        return;
    }

    // Construire les données à envoyer
    const data = {
        annee: parseInt(annee),
        mois: parseInt(mois),
        dep: dep 
    };

    // Affiche les données envoyées dans la console (pour déboguer)
    console.log("Données envoyées :", data);

    try {
        // Envoie les données à l'API Flask via une requête POST
        const response = await fetch('http://127.0.0.1:5000/predict_nb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)  // Données envoyées au serveur
        });

        // Récupère la réponse JSON du serveur
        const result = await response.json();
        if (result.error) {
            console.error("Erreur :", result.error);
            avertissement(`Erreur : ${result.error}`);
        } else {
            // Affiche la prédiction dans la console et dans une alerte
            console.log("Prédiction :", result.prediction);
            document.getElementById("predictionResult").innerHTML = `<p id = 'nb'> `+ result.prediction + ` accidents. </p>
                <div class = "info">
                    <div class="column">
                        <h3> À noter : </h3>
                        <p> Le modèle de prédiction a été entraîner avec des données de 2005 à 2013. </p>
                        <p> Il atteint la limite du nombre d'accidents en 2018. </p>
                        <p> Pour permettre de meilleur prédiction à plus long terme, il faudrait mettre à jour le modèle régulierement. </p>
                    </div>
                    <div class="column">
                        <h3> Attention : </h3>
                        <p> Ce chiffre reste une prédiction et ne doit pas être pris comme une valeur absolue. </p>
                        <p> Il est basé sur des modèles statistiques et des données historiques, 
                        mais il peut varier en fonction de nombreux facteurs imprévisibles. </p>
                    </div>
                </div>
            `
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }
});

