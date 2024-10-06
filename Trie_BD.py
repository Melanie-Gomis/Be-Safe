import pandas as pd
acc = pd.read_csv("accidents.csv", sep = ";", index_col=0)
acc.drop(columns=["date","original_city_code","original_name","geo_score","distance","v1","v2","pr","pr1","vosp","lartpc","larrout","env1","PR_display"], inplace = True)
print(acc.head())
