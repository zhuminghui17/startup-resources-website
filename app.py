from flask import Flask, jsonify, render_template
from config import AIRTABLE_API_KEY, AIRTABLE_ENDPOINT
import requests






app = Flask(__name__)

@app.route('/')
def serve_frontend():
    return render_template('index.html')




headers = {
    'Authorization': f"Bearer {AIRTABLE_API_KEY}",
    'Content-Type': 'application/json'
}

@app.route('/fetchData')
def fetch_data():
    response = requests.get(AIRTABLE_ENDPOINT, headers=headers)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        # Return a more detailed error message
        error_message = {
            "error": "Failed to fetch data from Airtable",
            "details": response.json()  # Assuming Airtable returns JSON error details
        }
        return jsonify(error_message), 500
