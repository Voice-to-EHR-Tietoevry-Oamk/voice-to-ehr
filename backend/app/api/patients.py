from flask import Blueprint, jsonify, request

bp = Blueprint('patients', __name__, url_prefix='/api/patients')

# Dummy patient data (for demonstration)
DUMMY_PATIENTS = [
    {
        'id': 1,
        'name': 'John Doe',
        'age': 45,
        'gender': 'Male',
        'records': []
    },
    {
        'id': 2,
        'name': 'Jane Smith',
        'age': 32,
        'gender': 'Female',
        'records': []
    },
    {
        'id': 3,
        'name': 'Michael Johnson',
        'age': 58,
        'gender': 'Male',
        'records': []
    }
]

@bp.route('/', methods=['GET'])
def get_patients():
    return jsonify({
        'success': True,
        'patients': DUMMY_PATIENTS
    })

@bp.route('/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    patient = next((p for p in DUMMY_PATIENTS if p['id'] == patient_id), None)
    if patient:
        return jsonify({
            'success': True,
            'patient': patient
        })
    return jsonify({
        'success': False,
        'message': 'Patient not found'
    }), 404

@bp.route('/<int:patient_id>/records', methods=['GET'])
def get_patient_records(patient_id):
    patient = next((p for p in DUMMY_PATIENTS if p['id'] == patient_id), None)
    if patient:
        return jsonify({
            'success': True,
            'records': patient.get('records', [])
        })
    return jsonify({
        'success': False,
        'message': 'Patient not found'
    }), 404

@bp.route('/<int:patient_id>/records', methods=['POST'])
def add_patient_record(patient_id):
    patient = next((p for p in DUMMY_PATIENTS if p['id'] == patient_id), None)
    if not patient:
        return jsonify({
            'success': False,
            'message': 'Patient not found'
        }), 404
    
    data = request.get_json()
    record = {
        'id': len(patient.get('records', [])) + 1,
        'timestamp': data.get('timestamp'),
        'symptoms': data.get('symptoms', ''),
        'diagnosis': data.get('diagnosis', ''),
        'treatment': data.get('treatment', '')
    }
    
    if 'records' not in patient:
        patient['records'] = []
    
    patient['records'].append(record)
    
    return jsonify({
        'success': True,
        'record': record
    }) 