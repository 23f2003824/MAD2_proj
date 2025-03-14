from flask import current_app as app
from backend.models import Service, db
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
        user_datastore.create_user(name='admin',username='admin', email='admin@study.iitm.ac.in', password=hash_password('pass'), roles=['admin'])   
    if ( not user_datastore.find_user(email='user01@study.iitm.ac.in')):
        user_datastore.create_user(name='firstCust',username='user01', email='user01@study.iitm.ac.in', password=hash_password('pass'), roles=['user'])   
    if ( not user_datastore.find_user(email='prof01@study.iitm.ac.in')):
        user_datastore.create_user(name='firstProf',username='prof01', email='prof01@study.iitm.ac.in', password=hash_password('pass'), roles=['service_professional'], description='did some good things', service_type='cleaning',experience=9) 
    if not Service.query.filter_by(name='cleaning').first():
        initial_service = Service(
        name='cleaning',
        description='Comprehensive home cleaning service including dusting, mopping, and vacuuming.',
        price=50.0,  # Example price
        duration=120  # Duration in minutes
    )  
        db.session.add(initial_service)

    db.session.commit()