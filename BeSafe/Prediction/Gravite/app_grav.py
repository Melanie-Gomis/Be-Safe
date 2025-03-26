from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime
import os

os.chdir('/Applications/MAMP/htdocs/BeSafe/Prediction/Gravite')

app_grav = Flask(__name__)
CORS(app_grav, origins='*')

model = joblib.load('pred_grav.pkl')

# Fonction de prétraitement pour la prédiction
def preprocess_data(data):
    # Conversion des variables qualitatives en numériques (cat.codes)
    cols_to_convert = ["lum", "agg", "intersec", "atm", "col", "LIBELLE_JOUR", "catr", "surf", "NOM_REG"]
    for col in cols_to_convert:
        if col in data:
            data[col] = int(pd.Series(data[col], dtype="category").cat.codes.iloc[0])

    # Conversion de la date en nombre de jours depuis le 1er janvier 2000
    if 'date_formated' in data:
        try:
            date = datetime.strptime(data['date_formated'], '%d/%m/%Y')
            reference_date = datetime(2000, 1, 1)
            data['date_formated'] = (date - reference_date).days
        except Exception as e:
            print(f"Erreur lors de la conversion de la date : {e}")
            data['date_formated'] = 0
        
    # Conversion de l'heure (heure:minute) en minutes
    if 'heures_minutes' in data:
        try:
            heures_minutes = pd.to_datetime(data['heures_minutes'], format='%H:%M')
            data['heures_minutes'] = heures_minutes.hour * 60 + heures_minutes.minute
        except Exception as e:
            print(f"Erreur lors de la conversion de l'heure : {e}")
            data['heures_minutes'] = 0

    # Conversion des coordonnées géographiques (multiplication par 1 milliard)
    if 'latitude' in data and 'longitude' in data:
        try:
            data['latitude'] = int(float(data['latitude']) * 1000000000)
            data['longitude'] = int(float(data['longitude']) * 1000000000)
        except Exception as e:
            print(f"Erreur lors de la conversion des coordonnées géographiques : {e}")
            data['latitude'] = 0
            data['longitude'] = 0

    # Conversion des champs numériques au format int
    data['mois'] = int(data.get('mois', 0))
    data['ANNEE'] = int(data.get('ANNEE', 0))
    data['has_voiture'] = int(data.get('has_voiture', 0))
    data['has_poidslourd'] = int(data.get('has_poidslourd', 0))
    data['has_pietons'] = int(data.get('has_pietons', 0))
    data['has_velo'] = int(data.get('has_velo', 0))
    data['deuxrouesmotorises_nb'] = int(data.get('deuxrouesmotorises_nb', 0))

    return data

@app_grav.route('/', methods=['POST'])
def index():
    return render_template('index.html', prediction=None)

@app_grav.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        processed_data = preprocess_data(data)

        new_data = [
            [
                processed_data.get('mois', 0),
                processed_data.get('lum', 0),
                processed_data.get('agg', 0),
                processed_data.get('intersec', 0),
                processed_data.get('atm', 0),
                processed_data.get('col', 0),
                processed_data.get('date_formated', 0),
                processed_data.get('heures_minutes', 0),
                processed_data.get('ANNEE', 0),
                processed_data.get('LIBELLE_JOUR', 0),
                processed_data.get('latitude', 0),
                processed_data.get('longitude', 0),
                processed_data.get('catr', 0),
                processed_data.get('surf', 0),
                processed_data.get('NOM_REG', 0),
                processed_data.get('has_voiture', 0),
                processed_data.get('deuxrouesmotorises_nb', 0),
                processed_data.get('has_velo', 0),
                processed_data.get('has_poidslourd', 0),
                processed_data.get('has_pietons', 0)
            ]
        ]

        gravite_labels = {
            0: "blessé léger",
            1: "hospitalisé",
            2: "tué"
        }

        prediction = model.predict(new_data)[0]
        label = gravite_labels.get(prediction, "Inconnu")
        print(prediction, " : \t ", label)

        # Retourner le chiffre + le label dans la réponse
        return jsonify({
            'prediction': label
        })

    except Exception as e:
        print(f"Erreur lors de la prédiction : {e}")
        return jsonify({'error': str(e)})
    

if __name__ == '__main__':
    app_grav.run(debug=True)