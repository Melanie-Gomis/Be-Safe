import pandas as pd
import os


os.chdir('../Données de base/') # mettre votre chemain de vos données

acc = pd.read_csv("accidents.csv", sep = ";", index_col=0, low_memory=False)
keep1 = ['Num_Acc','mois','lum','agg','int','atm', 'col', 'adr',
        'ANNEE','dep', 'LIBELLE_JOUR', 'HEURE', 'current_name', 'latitude',
        'longitude', 'catr', 'surf', 'NOM_REG', 'has_voiture',
        'deuxrouesmotorises_nb', 'has_velo', 'has_poidslourd', 'has_pietons',
        'indemne_nb', 'blesseleger_nb', 'hospitalise_nb', 'tue_nb',
         'gravite_accident']

acc.drop(columns = acc.columns.difference(keep1), inplace=True)

keep_years = [2022, 2017, 2012, 2007]
acc = acc.loc[acc['ANNEE'].isin(keep_years)]
print(acc.head())
print(acc.shape)

acc.to_csv("../Fichier/Accidents.csv", sep=";")

vic = pd.read_csv("usagers.csv", sep = ";", index_col=0)
keep2 = ['Num_Acc', 'id_usager','catu','grav','sexe','an_nais','trajet',]
vic.drop(columns = vic.columns.difference(keep2), inplace=True)
print(vic.head())

vic.to_csv("../Fichier/Victimes.csv", sep=";")

vehic = pd.read_csv("vehicules.csv", sep = ";", index_col=0)
keep3 = ['Num_Acc', 'id_vehicule', 'num_veh', 'catv', 'obs', 'obsm', 'motor']
vehic.drop(columns = vehic.columns.difference(keep3), inplace=True)
print(vehic.head())

vehic.to_csv("../Fichier/Vehicules.csv", sep=";")

