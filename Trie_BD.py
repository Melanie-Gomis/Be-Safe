import pandas as pd
acc = pd.read_csv("../accidents.csv", sep = ";", index_col=0)
keep = ['mois','lum','agg','inter','atm', 'collision', 'adresse',
        'annee', 'libelle_jour', 'heure', 'current_city_name', 'latitude',
        'longitude', 'catr', 'surface', 'nom_region', 'has_voiture',
        'has_deuxrouesmotorises', 'has_velo', 'has_poidslourd', 'has_pietons',
        'indemne_nb', 'blesseleger_nb', 'hospitalise_nb', 'tue_nb', 'gravite_accident']
acc.drop(columns=acc.columns.difference(keep), inplace=True)
print(acc.head())

vic = pd.read_csv("../usagers.csv", sep = ";", index_col=0)
vic.drop(columns=vic.columns.difference(['Num_victime']), inplace=True)
print(vic.head())
