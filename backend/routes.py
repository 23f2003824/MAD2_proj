from flask import current_app as app, jsonify, render_template, request, send_file
from flask_security import auth_required, verify_password, hash_password
from backend.models import db
from datetime import datetime
from backend.celery.tasks import add, db_to_csv
from celery.result import AsyncResult
import os


datastore= app.security.datastore
cache= app.cache

@app.get('/')
def home():
    return render_template('index.html')

#demo route to check celery

#used to start the celery application:- celery -A app:celery_app worker -l INFO
#the -l INFO option means that Celery will log all messages at the INFO level and above.
#we will use beat to automatically schedule tasks at regular intervals and worker for asynchronous tasks.

@app.route('/celery')
def celery():
    result = add.delay(2, 3)
    return jsonify({'task_id': result.id, 'result': result.get()})

@app.route('/celery/<id>')
def check_celery_result(id):
    task = AsyncResult(id)
    if task.ready():
        return jsonify({'result': task.get()})
    else:
        return jsonify({'result': 'Task is not completed'})
    
@app.route('/serviceCsv')
@auth_required('token')
def download_service_csv():
    task = db_to_csv.delay() #we use delay to schedule the task in the background using Celery
    return {'task_id': task.id}



@app.get('/getCsv/<id>')
@auth_required('token')
def download_csv(id):
    result = AsyncResult(id)

    print(f"Checking task: {id}, Ready: {result.ready()}, Result: {result.result}")

    if not result.ready():
        print("Task is not completed yet")
        return jsonify({'message': 'Task is not completed'}), 404

    filename = result.result

    if not filename:
        print("Error: Task result is None")
        return jsonify({'message': 'Task result is None'}), 500

    file_path = os.path.abspath(f'./backend/celery/user_downloads/{filename}')
    print(f"Generated file path: {file_path}")

    existing_files = os.listdir('./backend/celery/user_downloads/')  # Debugging
    print(f"Existing files: {existing_files}")

    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return jsonify({'message': 'File not found'}), 500

    try:
        print("Sending file...")
        return send_file(file_path, as_attachment=True), 200
    except Exception as e:
        print(f"Error in send_file: {e}")
        return jsonify({'message': str(e)}), 500


# demo route to check cache

# @app.route('/cache')
# @cache.cached(timeout=5)
# def cache():
#     return {"time": str(datetime.now())}


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

    if not email or not password:
        return jsonify({'message': 'email and password are required'}), 400
    
    user= datastore.find_user(email= email)
    if not user:
        return jsonify({'message': 'user not found or invalid email'}), 404
    if not user.active:  
        return jsonify({'message': 'Your account is inactive. Please contact support at admin@study.iitm.ac.in'}), 403
    
    if verify_password(password, user.password):
        return jsonify({'token': user.get_auth_token(),'email': user.email, 'role': user.roles[0].name, 'id': user.id, 'username': user.username}), 200
    
    return jsonify({'message': 'invalid password!'}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    role = data.get('role')
    name= data.get('name')
    description= data.get('description')
    service_type= data.get('service_type')
    experience= data.get('experience')

    if not email or not password or role not in ['admin', 'user', 'service_professional']:
        return jsonify({'message': 'email, password and username are required'}), 400
    
    user= datastore.find_user(email= email)
    if user:
        return jsonify({'message': 'user already exists'}), 400
    
    try:
        user= datastore.create_user(email= email, password= hash_password(password), username = username, roles=[role], active= True, name=name,description=description,service_type=service_type,experience=experience)
        db.session.commit()
        return jsonify({'message': 'user created successfully', 'id': user.id}), 201
    except:
        db.session.rollback()
        return jsonify({'message': 'error creating user'}), 500

# @auth_required('token')   
# @app.route('/service/new', methods=['POST'])
# def create_service():
#     data = request.get_json()
#     service_name = data.get('service_name')
#     description = data.get('description')
#     price = data.get('price')
#     duration = data.get('duration')

#     if not service_name or not description or not price or not duration:
#         return jsonify({'message': 'service_name, description, price and duration are required'}), 400
    
#     service= datastore.(title= title, description= description, price= price, user_id= user_id)
#     db.session.add(service)
#     db.session.commit()
#     return jsonify({'message': 'service created successfully', 'id': service.id}), 201