from flask import request, current_app as app
from flask_restful import Resource, Api,fields, marshal_with, marshal
from backend.models import Service,User, db
from flask_security import auth_required, current_user

cache= app.cache

api= Api(prefix= '/api')

service_fields={
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'price': fields.Float,
    'duration': fields.Integer
}

class ServiceAPI(Resource):
    
    # @marshal_with(service_fields)
    @auth_required('token')
    def get(self, service_id):
        service= Service.query.get(service_id)
        if not service:
            return {'message': 'service not found'}, 404
        # the below line is added with marshal so that the response is in the format of service_fields 
        return marshal(service, service_fields), 200    
    @auth_required('token')
    def delete(self, service_id):
        service= Service.query.get(service_id)
        if not service:
            return {'message': 'service not found'}, 404
        
        if current_user.roles[0].name == 'admin':
            db.session.delete(service)
            db.session.commit()
            return {'message': 'service deleted successfully'}, 200
        else:
            return {'message': 'you are not authorized to delete the service'}, 403

class ServiceListAPI(Resource):
    
    @marshal_with(service_fields)
    @auth_required('token')
    def get(self):
        services= Service.query.all()
        return services, 200

    @auth_required('token')
    def post(self):
        data= request.get_json()
        name= data.get('name')
        desc= data.get('description')
        price= data.get('price')
        duration= data.get('duration')
        if current_user.roles[0].name == 'admin':
            try:
                service= Service(name= name, description= desc, price= price, duration= duration)
                db.session.add(service)
                db.session.commit()
                return {'message': 'service created successfully'}, 201
            except:
                db.session.rollback()
                return {'message': 'service creation failed'}, 500
        else:
            return {'message': 'you are not authorized to create a service'}, 403
api.add_resource(ServiceAPI, '/services/<int:service_id>')
api.add_resource( ServiceListAPI, '/services')

user_fields={
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
}

class UserAPI(Resource):
    
    @marshal_with(user_fields)
    @auth_required('token')
    def get(self):
        services= User.query.all()
        return services, 200
api.add_resource( UserAPI, '/user')
