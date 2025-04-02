from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime
import os

os.chdir('/Applications/MAMP/htdocs/BeSafe/Prediction')

app = Flask(__name__)
CORS(app, origins='*')

# Importation pour la gravité  : le modèle
model_grav= joblib.load('pred_grav.pkl')

# Importation pour le nombre : le modèle, le label encoder et les csv 
model_nb = joblib.load('pred_nb.pkl')
le = joblib.load('label_encoder.pkl')

df_tendance = pd.read_csv("tendance.csv", sep=",")
df_tendance_mois = pd.read_csv("tendance_mois.csv", sep=",")

# Fonction de prétraitement pour la prédiction
def preprocess_data(data):
    """
    Entrée : 
        - data : les données brut issus du formulaire
    Sortie :
        - data : les données préparer pour correspondre à ceux qu'attend le modèle de prédiction
    """
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

@app.route('/', methods=['POST'])
def index():
    return render_template('index.html', prediction=None)

@app.route('/predict_grav', methods=['POST'])
def predict_grav():
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

        prediction = model_grav.predict(new_data)[0]
        label = gravite_labels.get(prediction, "Inconnu")
        print(prediction, " : \t ", label)

        # Retourner le chiffre + le label dans la réponse
        return jsonify({
            'prediction': label
        })

    except Exception as e:
        print(f"Erreur lors de la prédiction : {e}")
        return jsonify({'error': str(e)})

@app.route('/predict_nb', methods=['POST'])
def predict_nb():
    data = request.get_json()

    # Préparer les données pour la prédiction
    new_data = pd.DataFrame({
        'ANNEE': [data['annee']],
        'mois': [data['mois']],
        'dep': [data['dep']],
        'tendance': [None],
        'tendance_mois': [None]
    })

    # Encoder le département
    new_data['dep'] = le.transform(new_data['dep'])

    # Trouver les bonnes tendances
    new_data['tendance'] = df_tendance[df_tendance['dep'] == new_data['dep'].iloc[0]].iloc[0]['tendance']
    new_data['tendance_mois'] = df_tendance_mois[(df_tendance_mois['dep'] == new_data['dep'].iloc[0]) 
                            & (df_tendance_mois['mois'] == new_data['mois'].iloc[0])].iloc[0]['tendance_mois']


    # Faire la prédiction
    prediction = model_nb.predict(new_data)
    prediction = max(round(prediction[0]), 0)
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)