import pandas as pd

# Chargement des données
df = pd.read_csv('accidents.csv')

# Suppression des colonnes inutiles
df = df.drop(columns=["Num_Acc", "adr", "dep", 'indemne_nb', 'blesseleger_nb', 'hospitalise_nb', "current_name", 'tue_nb'])

# Conversion des variables qualitatives en numériques
cols_to_convert = ["lum", "agg", "intersec", "atm", "col", "LIBELLE_JOUR", "catr", "surf", "NOM_REG"]
for col in cols_to_convert:
    df[col] = df[col].astype('category').cat.codes

# Conversion de la variable cible
df["gravite_accident"] = df["gravite_accident"].replace({
    "blessé léger": 0,
    "hospitalisé": 1,
    "tué": 2
})

# Conversion de la date et de l'heure
df['date_formated'] = pd.to_datetime(df['date_formated'], format='%d/%m/%Y') 
df['date_formated'] = (df['date_formated'] - pd.Timestamp('2000-01-01')).dt.days # Nombre de jours depuis le 01/01/2000
df['heures_minutes'] = pd.to_datetime(df['heures_minutes'], format='%H:%M') 
df['heures_minutes'] = df['heures_minutes'].dt.hour * 60 + df['heures_minutes'].dt.minute # Nombre de minutes depuis minuit

# Conversion des coordonnées géographiques
df['latitude'] = (df['latitude'] * 1000000000).astype(int)
df['longitude'] = (df['longitude'] * 1000000000).astype(int)

# Sauvegarde du DataFrame
df.to_csv('DF_Discret.csv', index=False, sep=",", encoding='utf-8')
