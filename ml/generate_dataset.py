import pandas as pd
import numpy as np

np.random.seed(42)

rows = 800

data = {
    "clicks": np.random.randint(0, 100, rows),
    "time_spent": np.random.randint(0, 100, rows),
    "searches": np.random.randint(0, 100, rows),
    "bookmarks": np.random.randint(0, 100, rows)
}

df = pd.DataFrame(data)

categories = []

for i in range(rows):
    c = df.loc[i, "clicks"]
    t = df.loc[i, "time_spent"]
    s = df.loc[i, "searches"]
    b = df.loc[i, "bookmarks"]

    if c > 75:
        categories.append("Agriculture")
    elif t > 75:
        categories.append("Art_and_Culture")
    elif s > 75:
        categories.append("Architecture")
    elif b > 75:
        categories.append("History")

    elif c > 60:
        categories.append("Finance")
    elif t > 60:
        categories.append("Research_and_Development")
    elif s > 60:
        categories.append("Science_and_Technology")
    elif b > 60:
        categories.append("Space")

    elif c > 45:
        categories.append("Defence")
    elif t > 45:
        categories.append("Education")
    elif s > 45:
        categories.append("Medicine")
    elif b > 45:
        categories.append("Tourism")

    elif c > 30:
        categories.append("Transport")
    elif t > 30:
        categories.append("Energy")
    elif s > 30:
        categories.append("Forestry")
    else:
        categories.append("Handlooms")

df["category"] = categories

df.to_csv("user_behavior_dataset.csv", index=False)

print("Dataset generated successfully")
print("Total records:", len(df))
print("Categories included:", df["category"].nunique())
