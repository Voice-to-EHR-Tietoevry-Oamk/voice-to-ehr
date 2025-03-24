from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
    )
    
    # Register blueprints
    from app.api import auth, patients, voice
    app.register_blueprint(auth.bp)
    app.register_blueprint(patients.bp)
    app.register_blueprint(voice.bp)
    
    @app.route('/health')
    def health():
        return {'status': 'ok'}
    
    return app 