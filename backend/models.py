from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db= SQLAlchemy()

class User(db.Model, UserMixin):
    # UserMixin provides default implementations for the methods and properties required by the Flask-Security extension
    id= db.Column(db.Integer, primary_key= True)
    username= db.Column(db.String, unique= True, nullable= False)
    email= db.Column(db.String, unique= True, nullable= False)
    password= db.Column(db.String, nullable= False)

    #flask-security:-
    fs_uniquifier= db.Column(db.String, unique= True, nullable= False) #encrypted version of email and password and returns a token
    active= db.Column(db.Boolean, default= True)
    # Role.bearers will give the users with that role
    roles = db.relationship('Role', backref='bearers', secondary= 'user_roles')
    accepted= db.Column(db.Boolean, default=False)
    rejected= db.Column(db.Boolean, default=False)
    #attributes for service professional
    name= db.Column(db.String, nullable= True)
    date_created= db.Column(db.DateTime, default= datetime.now())
    description= db.Column(db.String, nullable= True)
    service_type= db.Column(db.String, nullable= True)
    experience= db.Column(db.Integer, nullable= True)



class Role(db.Model, RoleMixin):
    id= db.Column(db.Integer, primary_key= True)
    name= db.Column(db.String, unique= True, nullable= False)
    description= db.Column(db.String, nullable= False)

class UserRoles(db.Model): #this is read as user_roles
    id= db.Column(db.Integer, primary_key= True)
    user_id= db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id= db.Column(db.Integer, db.ForeignKey('role.id'))

class Service(db.Model):
    id= db.Column(db.Integer, primary_key= True)
    name= db.Column(db.String, unique= True, nullable= False)
    description= db.Column(db.String, nullable= False)
    price= db.Column(db.Float, nullable= False)
    duration= db.Column(db.Integer, nullable= False)
    
    #service_professional_id is the id of the user who provides this service
    # service_professional_id= db.Column(db.Integer, db.ForeignKey('user.id'))

class ServiceRequest(db.Model):
    id= db.Column(db.Integer, primary_key= True)
    user_id= db.Column(db.Integer, db.ForeignKey('user.id'))
    service_id= db.Column(db.Integer, db.ForeignKey('service.id'))
    date_of_request= db.Column(db.DateTime, nullable= False)
    date_of_completion= db.Column(db.DateTime, nullable= True)
    service_status= db.Column(db.String, nullable= False, default= 'pending')
    remarks= db.Column(db.String, nullable= True)
    address= db.Column(db.String, nullable= False)