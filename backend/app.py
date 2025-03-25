import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv(override=True)

# Log environment variables
print("\nEnvironment variables loaded:")
print(f"Current working directory: {os.getcwd()}")
print(f"OPENAI_API_KEY present: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")
print(f"OPENAI_API_KEY length: {len(os.getenv('OPENAI_API_KEY', ''))}")
print(f"FLASK_APP: {os.getenv('FLASK_APP')}")
print(f"FLASK_ENV: {os.getenv('FLASK_ENV')}\n")

from flask import Flask
from flask_cors import CORS
from routes.voice import voice

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Register blueprints
app.register_blueprint(voice, url_prefix='/api/voice')

if __name__ == '__main__':
    app.run(debug=True) 