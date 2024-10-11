import pandas as pd


acc = pd.read_csv("../accidents.csv", sep = ";", index_col=0)
keep1 = ['mois','lum','agg','inter','atm', 'collision', 'adresse',
        'annee', 'libelle_jour', 'heure', 'current_city_name', 'latitude',
        'longitude', 'catr', 'surface', 'nom_region', 'has_voiture',
        'has_deuxrouesmotorises', 'has_velo', 'has_poidslourd', 'has_pietons',
        'indemne_nb', 'blesseleger_nb', 'hospitalise_nb', 'tue_nb', 'gravite_accident']
acc.drop(columns = acc.columns.difference(keep1), inplace=True)
print(acc.head())

acc.to_csv("Accidents.csv", sep=";", index=False)


vic = pd.read_csv("../usagers.csv", sep = ";", index_col=0)
keep2 = ['Num_Acc', 'id_usager','catu','grav','sexe','an_nais','trajet',]
vic.drop(columns = vic.columns.difference(keep2), inplace=True)
print(vic.head())

vic.to_csv("Victimes.csv", sep=";", index=False)


vehic = pd.read_csv("../vehicules.csv", sep = ";", index_col=0)
keep3 = ['Num_Acc', 'id_vehicule', 'Num_Acc', 'num_veh', 'catv', 'obs', 'obsm', 'motor']
vehic.drop(columns = vehic.columns.difference(keep3), inplace=True)
print(vehic.head())

vehic.to_csv("Vehicules.csv", sep=";", index=False)
