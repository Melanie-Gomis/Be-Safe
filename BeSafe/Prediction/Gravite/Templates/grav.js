
// Copier les numéros d'urgences
function copyToClipboard(number) {
    navigator.clipboard.writeText(number)
    .then(() => {
        alert('Le numéro ' + number + ' a été copié dans le presse-papiers!');
    })
    .catch((error) => {
        console.error("Erreur lors de la copie dans le presse-papiers :", error);
    });
}

window.addEventListener('load', () => {

    // Fonction pour remplir automatiquement la date du jour
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    // Remplir automatiquement le champ date_formated au format JJ/MM/AAAA
    document.getElementById("date_formated").value = `${day}/${month}/${year}`;
    
    document.getElementById("mois").value = month;
    document.getElementById("ANNEE").value = year;
    document.getElementById("LIBELLE_JOUR").value = today.toLocaleString('fr-FR', { weekday: 'long' });

    // Récupération de la position géographique
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            document.getElementById("latitude").value = lat;
            document.getElementById("longitude").value = lon;

            try {
                // Requête vers l'API Nominatim pour obtenir la région
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
                const data = await response.json();

                if (data.address && data.address.state) {
                    document.getElementById("NOM_REG").value = data.address.state;
                } else {
                    console.warn("Impossible de déterminer la région.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la région :", error);
            }
        },
        (error) => {
            console.error("Erreur de géolocalisation :", error);
            alert("Impossible d'obtenir la position géographique. L'accident ne sera pas localisé.");
        }
    );

    // Gestion de l'envoi du formulaire
    document.getElementById("gravite-formulaire").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        let data = Object.fromEntries(formData);

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            let gravite = result.prediction;

            document.getElementById("indication").innerHTML =gravite
            console.log(gravite)
            if (gravite == "tué"){
                console.log("'mort'")
                document.getElementById("indication").innerHTML = `<h2>Risque mortel <br> Accident grave</h2>
                    <p>Cet accident pourrait être fatal. Il est impératif de contacter immédiatement les secours, si ce n’est pas déjà fait.</p>
                    <p>Ne touchez à aucune personne qui semble gravement blessée, sauf si leur vie est en danger immédiat. </p>
                    <p>Attendez l’arrivée des professionnels en restant calme et essayez de sécuriser les lieux pour éviter d'autres accidents.</p>
                `;
            } else if (gravite == "hospitalisé"){
                document.getElementById("indication").innerHTML = `<h2>Risque élevé <br> Hospitalisé</h2>
                    <p>Cet accident pourrait entraîner des blessures graves. Il est impératif de contacter les secours sans délai, si ce n’est pas déjà fait.</p>
                    <p>Ne touchez à aucune personne qui semble gravement blessée, sauf si leur vie est en danger immédiat.</p>
                    <p>Attendez l’arrivée des professionnels en restant calme et essayez de sécuriser les lieux pour éviter d'autres accidents.</p>
                `;
            } else if (gravite == "blessé léger"){
                document.getElementById("indication").innerHTML = `<h2>Risque Faible <br> Blessures Légères</h2>
                    <p>Cet accident présente pas un risque élevé.</p>
                    <p>Cependant, il est nécessaire de contacter les secours si une victime présente de sévères blessure.</p>
                `;
            } else {
                document.getElementById("indication").innerHTML = `<h2>Risque non prévisible</h2>
                    <p>Cet accident présente un risque inconnu.</p>
                    <p>Il est nécessaire de contacter les secours si une victime présente de sévères blessure.</p>
                `;
            }
            
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    });

});
