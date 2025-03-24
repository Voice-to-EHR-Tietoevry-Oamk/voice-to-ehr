from flask import Blueprint, jsonify, request, current_app
import os
import json
import base64
import tempfile
import datetime

bp = Blueprint('voice', __name__, url_prefix='/api/voice')

@bp.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """
    Transcribe audio file to text using a simple mock implementation.
    In production, this would connect to a proper speech recognition service.
    """
    if 'audio' not in request.json:
        return jsonify({
            'success': False,
            'message': 'No audio data provided'
        }), 400

    try:
        # In a real implementation, we would:
        # 1. Decode base64 audio
        # 2. Save to temp file
        # 3. Process with speech recognition
        # 4. Format as EHR
        
        # For demo, we'll return mock data
        transcription = {
            'success': True,
            'content': {
                'symptoms': 'Patient reports severe headache for the past 3 days, accompanied by nausea and sensitivity to light.',
                'diagnosis': 'Migraine with aura. Patient has history of similar episodes.',
                'treatment': 'Prescribed sumatriptan 50mg as needed for acute episodes. Advised to maintain headache diary and follow up in 2 weeks.'
            }
        }
        
        return jsonify(transcription)
    
    except Exception as e:
        current_app.logger.error(f"Transcription error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error processing audio: {str(e)}'
        }), 500

@bp.route('/save', methods=['POST'])
def save_transcription():
    """Save the transcription to patient record"""
    data = request.get_json()
    patient_id = data.get('patientId')
    transcription = data.get('transcription', {})
    
    # In a real app, save to database
    # For demo, just return success
    
    return jsonify({
        'success': True,
        'message': 'Transcription saved successfully',
        'recordId': f"record_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    }) 