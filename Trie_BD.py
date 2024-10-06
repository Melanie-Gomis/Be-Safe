import pandas as pd
data = pd.read_csv("accidents.csv", sep = ";", index_col=0)
data.head()
