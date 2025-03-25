from flask import Blueprint, jsonify, request

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Dummy user database (for demonstration)
DUMMY_USERS = {
    'doctor@example.com': {'password': 'password123', 'role': 'doctor'}
}

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Simple authentication (for demonstration)
    if email in DUMMY_USERS and DUMMY_USERS[email]['password'] == password:
        return jsonify({
            'success': True,
            'user': {
                'email': email,
                'role': DUMMY_USERS[email]['role']
            }
        })
    
    return jsonify({
        'success': False,
        'message': 'Invalid credentials'
    }), 401

@bp.route('/verify', methods=['GET'])
def verify_token():
    # For demonstration, just return success
    # In a real app, verify JWT token from auth header
    return jsonify({'success': True}) 