import pandas as pd

# Charger le fichier CSV
df = pd.read_csv("Accidents-2.csv")

# Sélectionner 3333 lignes aléatoires par année
df_filtered = df.groupby("ANNEE", group_keys=False).sample(n=3333, random_state=42, replace=False)

# Sauvegarder le fichier filtré
df_filtered.to_csv("data_filtered.csv", index=False)

print("Fichier filtré enregistré avec succès !")
