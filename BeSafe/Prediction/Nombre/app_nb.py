from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import os

os.chdir('/Applications/MAMP/htdocs/BeSafe/Prediction/Nombre')


df_tendance = pd.read_csv("tendance.csv", sep=",")
df_tendance_mois = pd.read_csv("tendance_mois.csv", sep=",")

app_nb = Flask(__name__)
CORS(app_nb, origins='*')

# Charger le modèle et le label encoder
model = joblib.load('pred_nb.pkl')
le = joblib.load('label_encoder.pkl')

@app_nb.route('/', methods=['GET'])
def index():
    return render_template('predi.php', prediction = None)


@app_nb.route('/predict_nb', methods=['POST'])
def predict():
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
    prediction = model.predict(new_data)
    prediction = max(round(prediction[0]), 0)
    return jsonify({'prediction': prediction})


if __name__ == '__main__':
    app_nb.run(debug=True)
