import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
import joblib



# 1. Charger des données :

df = pd.read_csv("Accidents_prediction.csv", sep=";")

# Regrouper par ANNEE, mois, et dep
df_accidents = df.groupby(['ANNEE', 'mois', 'dep']).size().reset_index(name='nb_accidents')



# 2. Encoder la colonne 'dep' avec LabelEncoder :

le = LabelEncoder()
df_accidents['dep'] = le.fit_transform(df_accidents['dep'])


# 3. Créer les données d'entraînement et de test :

# Diviser les données en train/test (2005-2013 pour l'entraînement et 2014-2016 pour le test)
train_data = df_accidents[df_accidents['ANNEE'] < 2014]
test_data = df_accidents[df_accidents['ANNEE'] >= 2014]
test_data = test_data.copy()

# Définir les caractéristiques et la cible 
X_train = train_data[['ANNEE', 'mois', 'dep']].fillna(0)
y_train = train_data['nb_accidents']

# Définir les mêmes caractéristiques et la même cible 
X_test = test_data[['ANNEE', 'mois', 'dep']].fillna(0)
y_test = test_data['nb_accidents']



# 4. Créer et entraîner le modèle de régression XGBoost :

model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, random_state=42)
model.fit(X_train, y_train)



# 5. Prédictire et évaluer :

y_pred = model.predict(X_test)

mse = mean_absolute_error(y_test, y_pred)
print(f'Erreur absolue moyenne (MSE): {mse}')



# 6. Visualiser les résultats :


# Visualisation 1 : 

#  Comparaison des prédictions et des valeurs réelles avec la droite y=x
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

ax1.scatter(y_test, y_pred, color='blue', label='Prédictions', alpha=0.6)
ax1.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], color='red', linestyle='--', label='x=y')
ax1.set_xlabel('Valeurs réelles')
ax1.set_ylabel('Prédictions')
ax1.set_title('Comparaison des Prédictions et des Valeurs Réelles')
ax1.legend()
ax1.grid(True)

# Prédictions et valeurs réelles par mois
test_data.loc[:, 'predictions'] = y_pred
test_data.loc[:, 'mois'] = test_data['mois'].astype(int)

reel_nb_accidents = test_data.groupby('mois')['nb_accidents'].mean()
prediction_nb_accidents = test_data.groupby('mois')['predictions'].mean()

ax2.plot(reel_nb_accidents.index, reel_nb_accidents, color='red', marker='o', label='Valeurs réelles')
ax2.plot(prediction_nb_accidents.index, prediction_nb_accidents, color='blue', marker='o', label='Prédictions')
ax2.set_xlabel('Mois')
ax2.set_ylabel('Nombre d\'accidents')
ax2.set_title('Prédictions et Valeurs Réelles par Mois')
ax2.legend()
ax2.grid(True)

# Afficher la figure avec les deux sous-graphes
plt.tight_layout()
plt.show()


# Visualisation 2 : 

# Prédictions et valeurs réelles par mois pour chaque année 2014, 2015, et 2016
# Filtrer les données pour l'année 2014
test_data_2014 = test_data[test_data['ANNEE'] == 2014]
real_accidents_2014 = test_data_2014.groupby('mois')['nb_accidents'].mean()
predicted_accidents_2014 = test_data_2014.groupby('mois')['predictions'].mean()

# Filtrer les données pour l'année 2015
test_data_2015 = test_data[test_data['ANNEE'] == 2015]
real_accidents_2015 = test_data_2015.groupby('mois')['nb_accidents'].mean()
predicted_accidents_2015 = test_data_2015.groupby('mois')['predictions'].mean()

# Filtrer les données pour l'année 2016
test_data_2016 = test_data[test_data['ANNEE'] == 2016]
real_accidents_2016 = test_data_2016.groupby('mois')['nb_accidents'].mean()
predicted_accidents_2016 = test_data_2016.groupby('mois')['predictions'].mean()

# Créer une figure avec trois sous-graphes (1 ligne, 3 colonnes)
fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(18, 6))

# Graphique pour 2014
ax1.plot(real_accidents_2014.index, real_accidents_2014, color='red', marker='o', label='Valeurs réelles')
ax1.plot(predicted_accidents_2014.index, predicted_accidents_2014, color='blue', marker='o', label='Prédictions')
ax1.set_xlabel('Mois')
ax1.set_ylabel('Nombre d\'accidents')
ax1.set_title('2014: Prédictions et Valeurs Réelles')
ax1.legend()
ax1.grid(True)

# Graphique pour 2015
ax2.plot(real_accidents_2015.index, real_accidents_2015, color='red', marker='o', label='Valeurs réelles')
ax2.plot(predicted_accidents_2015.index, predicted_accidents_2015, color='blue', marker='o', label='Prédictions')
ax2.set_xlabel('Mois')
ax2.set_ylabel('Nombre d\'accidents')
ax2.set_title('2015: Prédictions et Valeurs Réelles')
ax2.legend()
ax2.grid(True)

# Graphique pour 2016
ax3.plot(real_accidents_2016.index, real_accidents_2016, color='red', marker='o', label='Valeurs réelles')
ax3.plot(predicted_accidents_2016.index, predicted_accidents_2016, color='blue', marker='o', label='Prédictions')
ax3.set_xlabel('Mois')
ax3.set_ylabel('Nombre d\'accidents')
ax3.set_title('2016: Prédictions et Valeurs Réelles')
ax3.legend()
ax3.grid(True)

# Afficher la figure avec les trois sous-graphes
plt.tight_layout()
plt.show()


# Prédiction par mois et par année (2014, 2015, et 2016)
plt.figure(figsize=(10, 6))

# Tracer la courbe de prédictions pour 2014 (rose)
plt.plot(predicted_accidents_2014.index, predicted_accidents_2014, color='pink', marker='o', label='2014')

# Tracer la courbe de prédictions pour 2015 (orange)
plt.plot(predicted_accidents_2015.index, predicted_accidents_2015, color='orange', marker='o', label='2015')

# Tracer la courbe de prédictions pour 2016 (violet)
plt.plot(predicted_accidents_2016.index, predicted_accidents_2016, color='purple', marker='o', label='2016')

# Ajouter des labels et un titre
plt.xlabel('Mois')
plt.ylabel('Nombre d\'accidents')
plt.title('Prédictions par Mois pour 2014, 2015 et 2016')
plt.legend()
plt.grid(True)

# Afficher le graphique
plt.tight_layout()
plt.show()



# 9. Sauvegarder le modèle et les infos dans un fichier
joblib.dump(model, 'pred_nb.pkl')
joblib.dump(le, 'label_encoder.pkl')