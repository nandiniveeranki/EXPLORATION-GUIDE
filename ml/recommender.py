import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)

# -----------------------------
# 1. LARGE SYNTHETIC DATASET (WITH PATTERN)
# -----------------------------
samples = 800

# Features: clicks, time_spent, searches, bookmarks
X = np.random.randint(0, 10, size=(samples, 4))

# Label logic (THIS is the key)
# Category based on dominant feature
y = []
for row in X:
    if row[0] > row[1] and row[0] > row[2]:
        y.append(0)  # Agriculture
    elif row[1] > row[2]:
        y.append(1)  # Health
    elif row[2] > row[3]:
        y.append(2)  # Defence
    else:
        y.append(3)  # Tourism

y = np.array(y)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# -----------------------------
# 2. MODELS
# -----------------------------
models = {
    "Domain Centric Retrieval Model (NB)": GaussianNB(),
    "AI Personalization Engine (KNN)": KNeighborsClassifier(n_neighbors=5),
    "Knowledge Graph Reasoning Module (DT)": DecisionTreeClassifier(max_depth=5),
    "Ensemble Exploration Intelligence (RF)": RandomForestClassifier(
        n_estimators=120, max_depth=6, random_state=42
    )
}

# -----------------------------
# 3. TRAIN + EVALUATE
# -----------------------------
print("\nMODEL EVALUATION RESULTS\n")

accuracies = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    accuracies[name] = round(acc * 100, 2)
    print(f"{name} Accuracy: {accuracies[name]} %")

# -----------------------------
# 4. SAMPLE PREDICTION
# -----------------------------
sample_user = np.array([[7, 3, 2, 1]])
final_model = models["Ensemble Exploration Intelligence (RF)"]
prediction = final_model.predict(sample_user)

print("\nFinal Recommended Category ID:", prediction[0])
