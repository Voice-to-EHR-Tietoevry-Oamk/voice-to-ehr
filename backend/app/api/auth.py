from flask import Blueprint, jsonify, request

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Dummy user database (for demonstration)
DUMMY_USERS = {
    'doctor': {'password': 'password123', 'role': 'doctor'}
}

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Simple authentication (for demonstration)
    if username in DUMMY_USERS and DUMMY_USERS[username]['password'] == password:
        return jsonify({
            'success': True,
            'user': {
                'username': username,
                'role': DUMMY_USERS[username]['role']
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