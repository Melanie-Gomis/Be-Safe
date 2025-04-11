#importation des librairies
import pandas as pd
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import joblib

#importation de la base de données
df = pd.read_csv('DF_Discret.csv')

# Définition des features et de la cible
X = df.drop(columns=["gravite_accident"])
y = df["gravite_accident"]

# Smote pour équilibrer les classes en générant des données synthétiques
sampling_strategy = {
    0: max(y.value_counts()[0], int(y.value_counts()[0] * 1.25)), 
    1: max(y.value_counts()[1], int(y.value_counts()[1] * 1)),  
    2: max(y.value_counts()[2], int(y.value_counts()[2] * 20))     
}
smote = SMOTE(sampling_strategy=sampling_strategy, random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Séparation en données d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, random_state=42, test_size=0.2)

# Modèle XGBoost avec pondération des classes
xgb = XGBClassifier(scale_pos_weight=10, use_label_encoder=False, eval_metric='mlogloss')
xgb.fit(X_train, y_train)

# Recherche des meilleurs hyperparamètres
param_grid = {
    'n_estimators': [100, 200],
    'learning_rate': [0.01, 0.05, 0.1],
    'max_depth': [3, 5],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0]
}

grid_search = GridSearchCV(xgb, param_grid, cv=3, n_jobs=-1, verbose=1)
grid_search.fit(X_train, y_train)

# Meilleurs hyperparamètres
print("Meilleurs paramètres:", grid_search.best_params_)
print("Meilleur score:", grid_search.best_score_)

# Évaluation sur le jeu de test
y_pred = grid_search.best_estimator_.predict(X_test)
print(classification_report(y_test, y_pred))

# Matrice de confusion
cm = confusion_matrix(y_test, y_pred)
labels = sorted(y.unique())  # Récupère les classes présentes dans y
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# Distribution des classes prédites
plt.figure(figsize=(6, 4))
sns.histplot(y_pred, bins=3, kde=True, discrete=True)
plt.xlabel("Predicted Class")
plt.ylabel("Count")
plt.title("Distribution of Predicted Classes")
plt.xticks(labels)
plt.show()

# Importance des features
xgb_best = grid_search.best_estimator_  
feature_importance = xgb_best.get_booster().get_score(importance_type='weight')  

plt.figure(figsize=(10, 5))
sns.barplot(x=list(feature_importance.keys()), y=list(feature_importance.values()))
plt.xticks(rotation=90)
plt.title("Feature Importance in XGBoost")
plt.show()

# Sauvegarde du modèle
joblib.dump(xgb_best, 'pred_grav.pkl')