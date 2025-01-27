from flask import current_app as app, jsonify, render_template, request
from flask_security import auth_required, verify_password, hash_password
from backend.models import db

datastore= app.security.datastore

@app.get('/')
def home():
    return render_template('index.html')

@app.route('/protected')
@auth_required('token')
def protected():
    return 'protected'

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    #data.get('email') will return None if email is not present in the request whereas data['email'] will throw an error
    email = data.get('email')
    password = data.get('password')

    if not email and not password:
        return jsonify({'message': 'email and password are required'}), 400
    
    user= datastore.find_user(email= email)
    if not user:
        return jsonify({'message': 'user not found or invalid email'}), 404
    
    if verify_password(password, user.password):
        return jsonify({'token': user.get_auth_token(),'email': user.email, 'role': user.roles[0].name, 'id': user.id, 'username': user.username}), 200
    
    return jsonify({'message': 'invalid password'}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    role = data.get('role')

    if not email or not password or role not in ['admin', 'user']:
        return jsonify({'message': 'email, password and username are required'}), 400
    
    user= datastore.find_user(email= email)
    if user:
        return jsonify({'message': 'user already exists'}), 400
    
    try:
        user= datastore.create_user(email= email, password= hash_password(password), username = username, roles=[role], active= True)
        db.session.commit()
        return jsonify({'message': 'user created successfully', 'id': user.id}), 201
    except:
        db.session.rollback()
        return jsonify({'message': 'error creating user'}), 500