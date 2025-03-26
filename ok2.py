import pandas as pd
import os


os.chdir('../Données de base/') # mettre votre chemain de vos données


### ACC -----
acc = pd.read_csv("accidents.csv", sep = ";", index_col=0, low_memory=False)
keep1 = ['Num_Acc','mois','ANNEE','dep', 'current_name', 'latitude',
        'longitude', 'NOM_REG']
acc.drop(columns = acc.columns.difference(keep1), inplace=True)
acc.rename(columns={'int' : 'intersec'}, inplace = True)


metroploe =['Grand Est', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes',
            'Île-de-France', 'Corse', 'Pays de la Loire', 'Centre-Val de Loire',
            'Normandie', 'Hauts-de-France', 'Occitanie', 'Bretagne',
            'Nouvelle-Aquitaine', 'Bourgogne-Franche-Comté']
acc = acc.loc[acc['NOM_REG'].isin(metroploe)]

acc.dropna(inplace = True)
print(acc.head())
print(acc.shape)


acc.to_csv("../Fichier/Accidents_pred2.csv", sep=";")
