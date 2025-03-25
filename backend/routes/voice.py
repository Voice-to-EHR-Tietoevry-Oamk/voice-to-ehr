from flask import Blueprint, request, jsonify
from services.transcription import process_audio

voice = Blueprint('voice', __name__)

@voice.route('/transcribe', methods=['POST'])
def transcribe():
    """Handle audio transcription and EHR formatting"""
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        if not audio_file:
            return jsonify({"error": "Empty audio file"}), 400

        # Get the audio data
        audio_data = audio_file.read()
        if not audio_data:
            return jsonify({"error": "Empty audio data"}), 400

        # Process the audio file
        result = process_audio(audio_data)
        
        if "error" in result:
            return jsonify({"error": result["error"]}), 500

        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in transcribe route: {str(e)}")
        return jsonify({"error": str(e)}), 500 