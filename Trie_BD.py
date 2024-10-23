import pandas as pd
import os


os.chdir('../Données de base/') # mettre votre chemain de vos données

### ACC -----
acc = pd.read_csv("accidents.csv", sep = ";", index_col=0, low_memory=False)
keep1 = ['Num_Acc','mois','lum','agg','int','atm', 'col', 'adr',
        'ANNEE','dep', 'LIBELLE_JOUR', 'HEURE', 'current_name', 'latitude',
        'longitude', 'catr', 'surf', 'NOM_REG','has_voiture',
        'deuxrouesmotorises_nb', 'has_poidslourd', 'has_pietons', 'has_velo',
        'indemne_nb', 'blesseleger_nb', 'hospitalise_nb', 'tue_nb',
         'gravite_accident']
acc.drop(columns = acc.columns.difference(keep1), inplace=True)
acc.rename(columns={'int' : 'intersec'}, inplace = True)

keep_years = [2005, 2010, 2015]
acc = acc.loc[acc['ANNEE'].isin(keep_years)]

metroploe =['Grand Est', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes',
            'Île-de-France', 'Corse', 'Pays de la Loire', 'Centre-Val de Loire',
            'Normandie', 'Hauts-de-France', 'Occitanie', 'Bretagne',
            'Nouvelle-Aquitaine', 'Bourgogne-Franche-Comté']
acc = acc.loc[acc['NOM_REG'].isin(metroploe)]

pd.set_option('future.no_silent_downcasting', True)
acc['has_voiture'] = acc['has_voiture'].replace({True: 1, False: 0, "True": 1, "False": 0,"true": 1, "false": 0}).astype(int)
acc['has_poidslourd'] = acc['has_poidslourd'].replace({True: 1, False: 0, "True": 1, "False": 0,"true": 1, "false": 0}).astype(int)
acc['has_pietons'] = acc['has_pietons'].replace({True: 1, False: 0, "True": 1, "False": 0,"true": 1, "false": 0}).astype(int)
acc['has_velo'] = acc['has_velo'].replace({True: 1, False: 0, "True": 1, "False": 0,"true": 1, "false": 0}).astype(int)


acc.dropna(inplace = True)
print(acc.head())
print(acc.shape)


acc.to_csv("../Fichier/Accidents.csv", sep=";")

### VIC -----

vic = pd.read_csv("usagers.csv", sep = ";", index_col=0)
keep2 = ['Num_Acc', 'id_usager','catu','grav','sexe','an_nais','trajet',]
vic.drop(columns = vic.columns.difference(keep2), inplace=True)
print(vic.head())

vic.to_csv("../Fichier/Victimes.csv", sep=";")
### VEHIC -----
vehic = pd.read_csv("vehicules.csv", sep = ";", index_col=0)
keep3 = ['Num_Acc', 'id_vehicule', 'num_veh', 'catv', 'obs', 'obsm', 'motor']
vehic.drop(columns = vehic.columns.difference(keep3), inplace=True)
print(vehic.head())

vehic.to_csv("../Fichier/Vehicules.csv", sep=";",)

