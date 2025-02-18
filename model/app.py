import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient

# Load trained models
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("cosine_sim.pkl", "rb") as f:
    cosine_sim = pickle.load(f)

with open("products_data.pkl", "rb") as f:
    products_data = pickle.load(f)

# Connect to MongoDB (for real-time user event data)
client = MongoClient("mongodb+srv://anashenrya:attackanas17@onlineecommerce-cluster.0ckq4.mongodb.net/?retryWrites=true&w=majority&appName=OnlineEcommerce-Cluster")
db = client["test"]

app = Flask(__name__)

# Assign event weights
event_weights = {"view": 1, "search": 2, "add_to_cart": 3, "purchase": 5}

# Content-Based Filtering
def content_based_recommendations(product_id, top_n=5):
    if product_id not in products_data["_id"].values:
        return []
    idx = products_data.index[products_data["_id"] == product_id][0]
    similarity_scores = list(enumerate(cosine_sim[idx]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    recommended_indices = [i[0] for i in similarity_scores[1:top_n+1]]
    return products_data.iloc[recommended_indices]["_id"].tolist()

# Collaborative Filtering
def collaborative_filtering(user_id, top_n=5):
    events_data = pd.DataFrame(list(db.events.find({}, {"userId": 1, "productId": 1, "eventType": 1})))
    if events_data.empty:
        return []

    events_data["weight"] = events_data["eventType"].map(event_weights)
    user_interactions = events_data.groupby(["userId", "productId"])["weight"].sum().reset_index()
    user_item_matrix = user_interactions.pivot(index="userId", columns="productId", values="weight").fillna(0)

    if user_id not in user_item_matrix.index:
        return []

    user_vector = user_item_matrix.loc[user_id].values.reshape(1, -1)
    similarity_scores = cosine_similarity(user_vector, user_item_matrix)[0]
    similar_users = list(user_item_matrix.index[np.argsort(similarity_scores)[::-1]][1:])

    recommended_products = set()
    for similar_user in similar_users:
        recommended_products.update(user_interactions[user_interactions["userId"] == similar_user]["productId"].tolist())
        if len(recommended_products) >= top_n:
            break

    return list(recommended_products)[:top_n]

# Hybrid Recommendations API
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    user_id = str(data.get("user_id"))

    # Fetch user events
    user_events = pd.DataFrame(list(db.events.find({"userId": user_id}, {"productId": 1})))

    if user_events.empty:
        return jsonify({"message": f"No interactions found for user {user_id}", "recommendations": []})

    first_product_id = user_events["productId"].iloc[0]
    content_recs = content_based_recommendations(first_product_id)
    collaborative_recs = collaborative_filtering(user_id)

    hybrid_recommendations = list(set(content_recs + collaborative_recs))

    return jsonify({
        "user_id": user_id,
        "content_based": content_recs,
        "collaborative": collaborative_recs,
        "hybrid": hybrid_recommendations
    })

if __name__ == "__main__":
    app.run(debug=True)
