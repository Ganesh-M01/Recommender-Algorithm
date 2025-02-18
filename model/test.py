import requests

response = requests.post("http://127.0.0.1:5000/recommend", json={"user_id": "67b0f429ea5564202b96a19e5"})
print(response.json())
