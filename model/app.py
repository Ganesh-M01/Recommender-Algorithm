from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from bson import ObjectId  # Correct import

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load trained models
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("cosine_sim.pkl", "rb") as f:
    cosine_sim = pickle.load(f)

with open("products_data.pkl", "rb") as f:
    products_data = pickle.load(f)

# Ensure products_data is a DataFrame
if not isinstance(products_data, pd.DataFrame):
    products_data = pd.DataFrame(products_data)

# Connect to MongoDB
client = MongoClient(
    "mongodb+srv://anashenrya:attackanas17@onlineecommerce-cluster.0ckq4.mongodb.net/?retryWrites=true&w=majority&appName=OnlineEcommerce-Cluster")
db = client["test"]

# Event weights
event_weights = {"view": 1, "search": 2, "add_to_cart": 3, "purchase": 5}


# Content-Based Filtering
def content_based_recommendations(product_id, top_n=5):
    product_id = str(product_id)  # Ensure string format

    if product_id not in products_data["_id"].astype(str).values:
        return []

    idx = products_data.index[products_data["_id"].astype(str) == product_id].tolist()
    if not idx:
        return []

    idx = idx[0]
    similarity_scores = list(enumerate(cosine_sim[idx]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    recommended_indices = [i[0] for i in similarity_scores[1:top_n + 1]]

    return products_data.iloc[recommended_indices]["_id"].astype(str).tolist()


# Collaborative Filtering
def collaborative_filtering(user_id, top_n=12):
    events_cursor = db.events.find({}, {"userId": 1, "productId": 1, "eventType": 1})
    events_data = pd.DataFrame(list(events_cursor))

    if events_data.empty:
        return []

    events_data["weight"] = events_data["eventType"].map(event_weights)
    user_interactions = events_data.groupby(["userId", "productId"])["weight"].sum().reset_index()
    user_item_matrix = user_interactions.pivot(index="userId", columns="productId", values="weight").fillna(0)

    # Ensure user_id is in ObjectId format to match the index
    user_id_obj = ObjectId(user_id) if not isinstance(user_id, ObjectId) else user_id

    print(f"Available user IDs in user_item_matrix: {user_item_matrix.index.tolist()}")

    if user_id_obj not in user_item_matrix.index:
        # User has no interactions, return empty or default recommendations
        print(f"User ID {user_id} not found in the user_item_matrix.")
        return []

    user_vector = user_item_matrix.loc[user_id_obj].values.reshape(1, -1)
    similarity_scores = cosine_similarity(user_vector, user_item_matrix)[0]
    similar_users = list(user_item_matrix.index[np.argsort(similarity_scores)[::-1]][1:])

    recommended_products = set()
    for similar_user in similar_users:
        recommended_products.update(
            user_interactions[user_interactions["userId"] == similar_user]["productId"].astype(str).tolist()
        )
        if len(recommended_products) >= top_n:
            break

    return list(recommended_products)[:top_n]


# Recommendation API
@app.route("/recommend", methods=["POST", "OPTIONS"])
def recommend():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight request success"}), 200

    data = request.get_json()
    if not data or "user_id" not in data:
        return jsonify({"error": "Missing user_id in request"}), 400

    user_id = str(data["user_id"])  # user_id as string for response
    print(user_id)

    # Convert user_id to ObjectId for MongoDB query
    try:
        user_id_object = ObjectId(user_id)  # Correct conversion
    except Exception as e:
        return jsonify({"error": f"Invalid user_id format: {str(e)}"}), 400

    # Query MongoDB using ObjectId
    user_events_cursor = db["events"].find({"userId": user_id_object})
    print(user_events_cursor)

    # Convert to DataFrame
    user_events = pd.DataFrame(list(user_events_cursor))
    print(user_events)

    if user_events.empty:
        return jsonify({"message": f"No interactions found for user {user_id}", "recommendations": []})

    first_product_id = str(user_events["productId"].iloc[0])
    content_recs = content_based_recommendations(first_product_id)
    collaborative_recs = collaborative_filtering(user_id)
    hybrid_recommendations = list(set(content_recs + collaborative_recs))

    return jsonify({
        "user_id": user_id,
        "content_based": content_recs,
        "collaborative": collaborative_recs,
        "hybrid": hybrid_recommendations
    })


# Run Flask App
if __name__ == "__main__":
    app.run(debug=True, port=5000)
