import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.voice import voice

# Load environment variables first
load_dotenv(override=True)

# Log environment variables
print("\nEnvironment variables loaded:")
print(f"Current working directory: {os.getcwd()}")
print(f"OPENAI_API_KEY present: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")
print(f"OPENAI_API_KEY length: {len(os.getenv('OPENAI_API_KEY', ''))}")
print(f"FLASK_APP: {os.getenv('FLASK_APP')}")
print(f"FLASK_ENV: {os.getenv('FLASK_ENV')}\n")

app = Flask(__name__)

# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(voice, url_prefix='/api/voice')

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return '', 204
    
    try:
        data = request.get_json()
        # For demo, accept any login
        return jsonify({
            "success": True,
            "user": {
                "id": "1",
                "name": "Test Doctor",
                "role": "doctor"
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True) 