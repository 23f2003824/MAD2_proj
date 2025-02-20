from flask import request, current_app as app
from flask_restful import Resource, Api,fields, marshal_with, marshal
from backend.models import Service,User,Role, db
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
    @cache.memoize(timeout=5)
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

    @auth_required('token')
    def put(self, service_id):
        service= Service.query.get(service_id)
        if not service:
            return {'message': 'service not found'}, 404
        
        if current_user.roles[0].name == 'admin':
            data= request.get_json()
            name = data.get('name', service.name)
            description = data.get('description', service.description)
            price = data.get('price', service.price)
            duration = data.get('duration', service.duration)

            # Update service fields
            service.name = name
            service.description = description
            service.price = price
            service.duration = duration

            # Commit changes to the database
            db.session.commit()
            return {'message': 'service updated successfully'}, 200
        else:
            return {'message': 'you are not authorized to update the service'}, 403

class ServiceListAPI(Resource):
    
    @auth_required('token')
    @cache.cached(timeout=5)
    @marshal_with(service_fields)
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
    'roles': fields.List(fields.String),
    'active': fields.Boolean

}

# USER API
class UserAPI(Resource):
    
    @auth_required('token')
    @cache.cached(timeout=5)
    @marshal_with(user_fields)
    def get(self):
        # Query for users who have the 'user' role directly
        users_with_user_role = User.query.filter(User.roles.any(Role.name == 'user')).all()

        return users_with_user_role, 200

api.add_resource( UserAPI, '/users')



# service_professional API
professional_fields={
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'roles': fields.List(fields.String),
    'active': fields.Boolean
}

class professionalAPI(Resource):
    
    @auth_required('token')
    @cache.cached(timeout=5)
    @marshal_with(professional_fields)
    def get(self):
        # Query for users who have the 'user' role directly
        users_with_professional_role = User.query.filter(User.roles.any(Role.name == 'service_professional')).all()

        return users_with_professional_role, 200

api.add_resource( professionalAPI, '/professionals')


#block/unblock
class ToggleActiveStatusAPI(Resource):
    @auth_required('token')
    def post(self, user_id):
        data = request.get_json()  # Get JSON data from the request
        
        if not data or 'active' not in data:
            return {"message": "Invalid request, 'active' field is required"}, 400

        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        user.active = data.get('active')
        db.session.commit()

        return {"message": "User status updated", "active": user.active}, 200

# Add the route to the API
api.add_resource(ToggleActiveStatusAPI, '/toggle-status/<int:user_id>')