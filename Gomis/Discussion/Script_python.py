import os
import pandas as pd
import math
import spacy # Pour les stopwords
import json
import sys

# Pour transformer tout le text en minuscule
def petit(texte):
    return texte.lower().split()

# Fonction pour évaluer une phrase
def evaluer_phrase(phrase):
    mots = set(petit(phrase))
    score = sum(ScoreMap.get(mot, 0) for mot in mots if mot not in stopwords)
    return score


# Verifie que le chemin est bien défini avec le debugueur (qui n'est pas utile sans VS)
current_directory = os.getcwd()
# print("Répertoire de travail courant:", current_directory)


tableau_base = pd.read_csv("sampled_train/annotations_metadata.csv", sep = ",", index_col = 0)
# print(tableau_base.head())

liste_label = tableau_base.iloc[:, -1].tolist()
liste_id_texte = tableau_base.index.tolist()

liste_texte = {}
for id in liste_id_texte:
    try:
        with open(f"sampled_train/all_textes/{id}.txt", 'r', encoding='utf-8') as fichier:
            liste_texte[id] = fichier.read()
    except :
        pass

# Stopwords
stopwords = spacy.load("en_core_web_sm").Defaults.stop_words

N = len(liste_texte)

# Calcule le nombre de texte contenant chaque mot
nb_apparition = {}
for id, texte in liste_texte.items():
    phrase = set(petit(texte))
    for mot in phrase:
        if mot not in stopwords:
            if mot in nb_apparition:
                nb_apparition[mot] += 1 
            else:
                nb_apparition[mot] = 1

# Calculer l'IDF pour chaque mot
idf = {}
for mot, nombre in nb_apparition.items():
    idf[mot]= math.log(N / nombre)

ScoreMap = {mot: 0 for mot in nb_apparition}

for id, texte in liste_texte.items():
    phrase = set(petit(texte))
    label = liste_label[liste_id_texte.index(id)]

    tf = {}
    for mot in phrase:
        if mot not in stopwords:
            if mot in tf:
                tf[mot] += 1
            else:
                tf[mot] = 1

    for mot in tf:
        tf_idf = tf[mot] * idf[mot]
        if label == "hate":
            ScoreMap[mot] -= tf_idf
        else:
            ScoreMap[mot] += tf_idf

""" 
print()
print(f"Score de 'death' : {ScoreMap['death']}")
print(f"Score de 'death' : {ScoreMap['happy']}")

score = evaluer_phrase("You're so stupid, just shut up and get lost, idiot")
print(score)
score = evaluer_phrase("You are an amazing person, and your kindness brightens everyone's day")
print(score) # Mauvais score --> pas très efficace
"""

with open('ScoreMap.json', 'w') as f:
    json.dump(ScoreMap, f)