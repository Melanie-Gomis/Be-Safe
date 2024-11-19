import pandas as pd
accidents = pd.read_csv("/Users/samy/Documents/Gestion_projet/accidents.csv", sep=";")
accidents.drop(columns=["date", "original_city_code", "original_name", "geo_score", "distance", "v1", "v2", "pr", "pr1", "vosp", "lartpc", "larrout", "env1", "PR_display"], inplace=True)
print(accidents.lum.head(0))