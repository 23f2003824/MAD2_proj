from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()
    # Create a user to test with
    user_datastore: SQLAlchemyUserDatastore = app.security.datastore
    user_datastore.find_or_create_role(name='admin', description='superUser')
    user_datastore.find_or_create_role(name='user', description='generalUser')
    user_datastore.find_or_create_role(name='service_professional', description='serviceProfessional')

    #for testing
    if ( not user_datastore.find_user(email='admin@study.iitm.ac.in')):
        user_datastore.create_user(username='admin', email='admin@study.iitm.ac.in', password=hash_password('pass'), roles=['admin'])   
    if ( not user_datastore.find_user(email='user01@study.iitm.ac.in')):
        user_datastore.create_user(username='user01', email='user01@study.iitm.ac.in', password=hash_password('pass'), roles=['user'])   

    db.session.commit()