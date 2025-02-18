import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://anashenrya:attackanas17@onlineecommerce-cluster.0ckq4.mongodb.net/?retryWrites=true&w=majority&appName=OnlineEcommerce-Cluster")
db = client["test"]

# Load existing products (if available)
try:
    with open("products_data.pkl", "rb") as f:
        old_products = pickle.load(f)
    old_product_ids = set(old_products["_id"].tolist())
except FileNotFoundError:
    old_product_ids = set()

# Fetch latest product data
products_data = pd.DataFrame(list(db.products.find({}, {"_id": 1, "title": 1, "description": 1})))
products_data["_id"] = products_data["_id"].astype(str)
products_data["combined_features"] = products_data["title"].fillna("") + " " + products_data["description"].fillna("")

# Check if new products are added
new_product_ids = set(products_data["_id"].tolist())

if new_product_ids != old_product_ids:
    print("🆕 New products detected! Retraining the model...")

    # Compute TF-IDF matrix
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(products_data["combined_features"])

    # Compute cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Save updated models
    with open("vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)

    with open("cosine_sim.pkl", "wb") as f:
        pickle.dump(cosine_sim, f)

    with open("products_data.pkl", "wb") as f:
        pickle.dump(products_data, f)

    print("✅ Model retrained and updated with new products!")
else:
    print("✅ No new products detected. Model remains unchanged.")
