from datetime import datetime
from flask import request, current_app as app
from flask_restful import Resource, Api,fields, marshal_with, marshal
from sqlalchemy import func
from backend.models import Service, ServiceRequest,User,Role, UserRoles, db
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
    'name': fields.String,
    'email': fields.String,
    'roles': fields.List(fields.String),
    'active': fields.Boolean

}

# USER API
class UserAPI(Resource):
    
    # @auth_required('token')
    @cache.cached(timeout=5)
    @marshal_with(user_fields)
    def get(self):
        try:
            # Query for users who have the 'user' role directly
            users_with_user_role = User.query.filter(User.roles.any(Role.name == 'user')).all()
            return users_with_user_role, 200
        except Exception as e:
            return {'message': str(e)}, 500
        

    @auth_required('token')
    def delete(self, user_id):
        user= User.query.get(user_id)
        if not user:
            return {'message': 'user not found'}, 404
        
        if current_user.roles[0].name == 'user' or current_user.roles[0].name == 'service_professional':
            db.session.delete(user)
            db.session.commit()
            return {'message': 'user deleted successfully'}, 200
        else:
            return {'message': 'you are not authorized to delete the user'}, 403
        
    @auth_required('token')
    def put(self, user_id):
        user= User.query.get(user_id)
        if not user:
            return {'message': 'user not found'}, 404
        
        if current_user.roles[0].name == 'user' or current_user.roles[0].name == 'service_professional':
            data= request.get_json()
            username = data.get('username', user.username)
            email = data.get('email', user.email)
            name=data.get('name', user.name)
            # Update service fields
            user.username = username
            user.email=email
            user.name=name
            # Commit changes to the database
            db.session.commit()
            return {'message': 'user updated successfully'}, 200
        else:
            return {'message': 'you are not authorized to update the user'}, 403

api.add_resource( UserAPI, '/users', '/user/<int:user_id>')

class IndividualUserAPI(Resource):
    @auth_required('token')
    @marshal_with(user_fields)
    def get(self, user_id):
        user= User.query.get(user_id)
        if not user:
            return {'message': 'user not found'}, 404
        return user, 200

api.add_resource(IndividualUserAPI, '/individualUser/<int:user_id>')

# service_professional API
professional_fields={
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'roles': fields.List(fields.String),
    'active': fields.Boolean,
    'accepted':fields.Boolean,
    'rejected':fields.Boolean,
    'name': fields.String,
    'description': fields.String,
    'experience': fields.Integer,
    'service_type': fields.String,
    'rating':fields.Integer

}

class professionalAPI(Resource):
    
    # @auth_required('token')
    @cache.cached(timeout=5)
    @marshal_with(professional_fields)
    def get(self):
        try:
            # Query for users who have the 'service_professional' role directly
            users_with_professional_role = User.query.filter(User.roles.any(Role.name == 'service_professional')).all()
            return users_with_professional_role, 200
        except Exception as e:
            return {'message': str(e)}, 500

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
        if current_user.roles[0].name == "admin":

            user.active = data.get('active')
            db.session.commit()
        else:
            return {"message": "You are not authorized to update the user"}, 403
        return {"message": "User status updated", "active": user.active}, 200
    
api.add_resource(ToggleActiveStatusAPI, '/toggle-status/<int:user_id>')

class AcceptProfileAPI(Resource):
    @auth_required('token')

    def post(self, user_id):
        data = request.get_json()

        if not data or 'accepted' not in data:
            return {"message": "Invalid request, 'accepted' field is required"}, 400

        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        if current_user.roles[0].name == "admin" and not(user.rejected):

            user.accepted = data.get('accepted')
            db.session.commit()
        else:
            return {"message": "You are not authorized to update the user"}, 403

        return {"message": "User status updated", "accepted": user.accepted}, 200
api.add_resource(AcceptProfileAPI, '/acceptProf/<int:user_id>')

class RejectProfileAPI(Resource):
    @auth_required('token')

    def post(self, user_id):
        data = request.get_json()

        if not data or 'rejected' not in data:
            return {"message": "Invalid request, 'accepted' field is required"}, 400

        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        if current_user.roles[0].name == "admin":

            user.rejected = data.get('rejected')
            db.session.commit()
            return {"message": "User rejected", "rejected": user.rejected, "user_id": user.id}, 200
        else:
            return {"message": "You are not authorized to update the user"}, 403
api.add_resource(RejectProfileAPI, '/rejectProf/<int:user_id>')


# service booking API
class BookServiceAPI(Resource):
    @auth_required('token')
    def post(self):
        data = request.get_json()
        professional_id = data.get('professional_id')
        service_id = data.get('service_id')
        address = data.get('address')
        date_of_request = data.get('date_of_request')  # Format: "YYYY-MM-DD"
        remarks = data.get('remarks')

        professional = User.query.get(professional_id)
        service = Service.query.get(service_id)

        if not professional or not service:
            return {'message': 'Invalid professional or service'}, 400

        # Validate required fields
        if not address or not date_of_request:
            return {'message': 'Address and date of request are required'}, 400

        try:
            date_of_request = datetime.strptime(date_of_request, "%Y-%m-%d")
        except ValueError:
            return {'message': 'Invalid date format. Use YYYY-MM-DD.'}, 400

        # Create a new booking
        booking = ServiceRequest(
            user_id=current_user.id,
            professional_id=professional_id,
            service_id=service_id,
            address=address,
            date_of_request=date_of_request,  # Stores full datetime
            remarks=remarks
        )

        db.session.add(booking)
        db.session.commit()

        return {'message': 'Service booked successfully', 'booking_id': booking.id}, 201

api.add_resource(BookServiceAPI, '/book_service')


# service Request API
class ServiceRequestAPI(Resource):
    @auth_required('token')
    def get(self):
        if current_user.roles[0].name == "user":
            # Fetch service requests made by the user
            service_requests = ServiceRequest.query.filter_by(user_id=current_user.id).all()
        elif current_user.roles[0].name == "service_professional":
            # Fetch service requests assigned to the professional
            service_requests = ServiceRequest.query.filter_by(professional_id=current_user.id).all()
        else:
            return {'message': 'Not authorised to view service history'}, 403

        if not service_requests:
            return {'message': 'No service requests found'}, 404

        requests_data = []
        for request in service_requests:
            requests_data.append({
                'id': request.id,
                'service_id': request.service_id,
                'service_name': request.service.name,
                'user_id': request.user_id,
                'user_name': request.user.name,
                'user_active': request.user.active,  
                'professional_id': request.professional_id,
                'professional_name': request.professional.name,
                'professional_active': request.professional.active,
                'service_status': request.service_status,
                'address': request.address,
                'date_of_request': request.date_of_request.strftime('%Y-%m-%d'),
                'date_of_completion': request.date_of_completion.strftime('%Y-%m-%d') if request.date_of_completion else None,
                'remarks': request.remarks,
                'rating': request.service_rating
            })

        return {'service_requests': requests_data}, 200
    @auth_required('token')
    def delete(self, request_id):
        # Fetch the service request by ID
        request = ServiceRequest.query.get(request_id)

        if not request:
            return {'message': 'Service request not found'}, 404

        # Ensure only the request owner can delete it
        if request.user_id != current_user.id:
            return {'message': 'Unauthorized to delete this request'}, 403

        # Allow deletion only if the request is in "pending" state
        if request.service_status != "pending":
            return {'message': 'Cannot delete a request that is already processed'}, 400

        try:
            db.session.delete(request)
            db.session.commit()
            return {'message': 'Service request deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error deleting request: {str(e)}'}, 500
        
api.add_resource(ServiceRequestAPI, '/service_requests', '/service_requests/<int:request_id>')

    
class UpdateServiceRequestStatusAPI(Resource):
    @auth_required('token')
    def put(self):
        data = request.get_json()
        request_id = data.get('request_id')
        new_status = data.get('new_status')

        if not request_id or not new_status:
            return {'message': 'Missing request_id or new_status'}, 400

        service_request = ServiceRequest.query.get(request_id)

        if not service_request:
            return {'message': 'Service request not found'}, 404


        # Update status
        service_request.service_status = new_status

        if new_status == "closed":
            service_request.date_of_completion = datetime.now()

        db.session.commit()

        return {
            'message': 'Service request updated successfully',
            'service_status': service_request.service_status
        }, 200
api.add_resource(UpdateServiceRequestStatusAPI, '/update_request_status')




# professional rating api
class RateProfessionalAPI(Resource):
    @auth_required('token')
    def post(self, professional_id):
        data = request.get_json()
        new_rating = data.get('rating')
        request_id = data.get('request_id')  # ✅ Get the service request ID

        if not (1 <= new_rating <= 5):
            return {"message": "Invalid rating. Must be between 1 and 5."}, 400

        # Fetch the professional
        professional = User.query.get(professional_id)
        if not professional:
            return {"message": "Professional not found"}, 404

        # Fetch the related service request
        service_request = ServiceRequest.query.get(request_id)
        if not service_request or service_request.professional_id != professional_id:
            return {"message": "Invalid service request for this professional"}, 400

        # Store the rating in the specific service request
        service_request.service_rating = new_rating

        # Update professional's average rating
        if professional.rating is None:
            professional.rating = new_rating
            professional.rating_count = 1
        else:
            total_ratings = professional.rating_count
            professional.rating = (professional.rating * total_ratings + new_rating) / (total_ratings + 1)
            professional.rating_count += 1

        db.session.commit()

        return {
            "message": "Rating submitted successfully",
            "new_average_rating": round(professional.rating, 2),
            "service_request_id": service_request.id,
            "service_rating": service_request.service_rating
        }, 200

api.add_resource(RateProfessionalAPI, '/rate_professional/<int:professional_id>')

# summary API for user and professional

class ProfessionalSummaryAPI(Resource):
    @auth_required('token')
    def get(self):
        user_role = current_user.roles[0].name

        response_data = {
            "total_requests": 0,
            "status_counts": {"pending": 0, "closed": 0, "rejected": 0, "accepted": 0, "completed": 0},
        }

        # Fetch service requests based on user role
        if user_role == "service_professional":
            service_requests = ServiceRequest.query.filter_by(professional_id=current_user.id).all()
            
            # Additional fields for service professionals
            response_data["average_rating"] = 0
            response_data["rating_counts"] = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

        elif user_role == "user":
            service_requests = ServiceRequest.query.filter_by(user_id=current_user.id).all()
        else:
            return {"message": "Unauthorized"}, 403

        if not service_requests:
            return response_data, 200

        total_rating = 0
        rated_services = 0

        for request in service_requests:
            response_data["status_counts"][request.service_status] = response_data["status_counts"].get(request.service_status, 0) + 1
            
            if user_role == "service_professional" and request.service_rating:
                total_rating += request.service_rating
                rated_services += 1
                response_data["rating_counts"][request.service_rating] += 1

        response_data["total_requests"] = len(service_requests)

        if user_role == "service_professional":
            response_data["average_rating"] = round(total_rating / rated_services, 2) if rated_services > 0 else 0

        return response_data, 200

api.add_resource(ProfessionalSummaryAPI, '/professional_summary')

# summary api for admin

class AdminSummaryAPI(Resource):
    @auth_required("token")
    def get(self):
        # Check if the current user has the "admin" role
        user_role = current_user.roles[0].name
        if user_role!='admin':
            return {"message": "Unauthorized"}, 403

        response_data = {
            "total_professionals": 0,
            "total_users": 0,
            "total_requests": 0,
            "status_counts": {"pending": 0, "accepted": 0, "completed": 0, "rejected": 0, "closed": 0,},
            "professional_avg_ratings": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            "professionals_per_service": {},
            "requests_per_service": {}
        }

        # Get role IDs for service professionals and users
        professional_role = Role.query.filter_by(name="service_professional").first()
        user_role = Role.query.filter_by(name="user").first()

        # Count professionals and users
        if professional_role:
            response_data["total_professionals"] = (
                User.query.join(UserRoles)
                .filter(UserRoles.role_id == professional_role.id, User.accepted == True)
                .count()
            )
            if user_role:
                response_data["total_users"] = User.query.join(UserRoles).filter(UserRoles.role_id == user_role.id).count()

        # Total service requests
        response_data["total_requests"] = ServiceRequest.query.count()

        # Count of service requests by status
        status_counts = (
            db.session.query(ServiceRequest.service_status, func.count(ServiceRequest.id))
            .group_by(ServiceRequest.service_status)
            .all()
        )
        for status, count in status_counts:
            response_data["status_counts"][status] = count

        # Average ratings of professionals
        rating_counts = (
            db.session.query(User.rating, func.count(User.id))
            .join(UserRoles)
            .filter(UserRoles.role_id == professional_role.id, User.rating.isnot(None))
            .group_by(User.rating)
            .all()
        )
        for rating, count in rating_counts:
            response_data["professional_avg_ratings"][int(rating)] = count
        
        professionals_per_service = (
            db.session.query(User.service_type, func.count(User.id))
            .filter(User.service_type.isnot(None), User.accepted == True)
            .group_by(User.service_type)
            .all()
        )
        for service_type, count in professionals_per_service:
            response_data["professionals_per_service"][service_type] = count

        # Number of service requests per service
        requests_per_service = (
            db.session.query(Service.name, func.count(ServiceRequest.id))
            .join(ServiceRequest, Service.id == ServiceRequest.service_id)
            .filter(ServiceRequest.service_status.in_(['accepted', 'completed', 'closed']))
            .group_by(Service.name)
            .all()
        )
        for service_name, count in requests_per_service:
            response_data["requests_per_service"][service_name] = count

        return response_data, 200

# Registering the API resource
api.add_resource(AdminSummaryAPI, "/admin_summary")
