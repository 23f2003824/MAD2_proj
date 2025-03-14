from datetime import datetime, timedelta
from celery import shared_task
from flask import current_app as app  # ✅ Use `current_app` for Flask context
from backend.celery.mailService import send_email
from backend.models import Role, User, UserRoles, db, Service, ServiceRequest
import flask_excel

#need to re run celery worker if any changes are made to this file
@shared_task(ignore_result=False) #by default it is also false, we want it to be true
def add(x, y):
    return x + y

@shared_task(ignore_result=False)
def email_notification(to, subject, content):
    send_email(to, subject, content) # sending email using mailService.py

@shared_task(bind=True, ignore_result=False)
def db_to_csv(self):
    resource = ServiceRequest.query.filter_by(service_status='closed').all()
    print("Retrieved Data:", resource)

    # Convert SQLAlchemy objects to dicts (Only closed service requests)
    data_list = []
    for req in resource:
        data_list.append({
            "id": req.id,
            "user_id": req.user_id,
            "professional_id": req.professional_id,
            "service_id": req.service_id,
            "date_of_request": req.date_of_request.strftime('%Y-%m-%d') if req.date_of_request else None,
            "date_of_completion": req.date_of_completion.strftime('%Y-%m-%d') if req.date_of_completion else None,
            "service_status": req.service_status,
            "remarks": req.remarks,
            "address": req.address,
            "service_rating": req.service_rating
        })

    # Get Task ID
    task_id = self.request.id
    print("Task ID:", task_id)

    # Define Filename
    filename = f'services_data_{task_id}.csv'
    print("Filename:", filename)

    # Column Names
    column_names = [
        "id", "user_id", "professional_id", "service_id",
        "date_of_request", "date_of_completion",
        "service_status", "remarks", "address", "service_rating"
    ]

    # Generate CSV Output
    csv_out = flask_excel.make_response_from_array([column_names] + [list(d.values()) for d in data_list], "csv")

    # Save CSV File
    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file:
        file.write(csv_out.data)

    print(f"Task returning filename: {filename}")

    return filename
@shared_task(ignore_result=False)
def send_daily_reminders():
    """Sends daily reminders to professionals with pending service requests."""
    print("📧 Sending daily reminders...")
    with app.app_context():
        # Find professionals with pending service requests
        professionals = (
            db.session.query(User)
            .join(ServiceRequest, User.id == ServiceRequest.professional_id)
            .filter(ServiceRequest.service_status == "pending")
            .distinct()
            .all()
        )

        if not professionals:
            print("✅ No pending service requests. No emails sent.")
            return

        for professional in professionals:
            pending_requests = ServiceRequest.query.filter_by(
                professional_id=professional.id, service_status="pending"
            ).all()

            if pending_requests:
                # Format email content
                subject = "🔔 Daily Reminder: Pending Service Requests"
                body = f"""
                <h3>Hello {professional.name},</h3>
                <p>You have {len(pending_requests)} pending service request(s).</p>
                <ul>
                    {''.join(f"<li>Request ID: {req.id}, Requested on: {req.date_of_request}, Address:{req.address}</li>" for req in pending_requests)}
                </ul>
                <p>Please review and take action.</p>
                <p>Thank you!</p>
                """

                # Send email
                email_notification.s(professional.email, subject, body).apply_async()

        print(f"✅ {len(professionals)} professional notified about pending requests.")




@shared_task(ignore_result=False)
def send_monthly_activity_report():
    """Generates and sends a monthly activity report to users."""
    with app.app_context():
        users = User.query.join(UserRoles).join(Role).filter(Role.name == "user").all()
        
        for user in users:
            # first_day_of_current_month = datetime.now().replace(day=1)

            # # Get last day of the previous month (1 day before the first day of current month)
            # last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)

            # # Get first day of the previous month
            # first_day_of_previous_month = last_day_of_previous_month.replace(day=1)

            # start_date = first_day_of_previous_month  # First day of last month
            # end_date = first_day_of_current_month  #First day of current month


            # hardcoded dates for checking
            start_date = datetime(2025, 3, 1)  # Example: 1st Feb 2024
            end_date = datetime(2025, 3, 23) 


            services_requested = ServiceRequest.query.filter(
                ServiceRequest.user_id == user.id,
                ServiceRequest.date_of_request >= start_date,
                ServiceRequest.date_of_request < end_date
            ).count()
            services_closed = ServiceRequest.query.filter(
                ServiceRequest.user_id == user.id,
                ServiceRequest.service_status == "closed",
                ServiceRequest.date_of_request >= start_date,
                ServiceRequest.date_of_completion < end_date
            ).count()
            services_pending = ServiceRequest.query.filter(
                ServiceRequest.user_id == user.id,
                ServiceRequest.service_status == "pending",
                ServiceRequest.date_of_request >= start_date,
                ServiceRequest.date_of_request < end_date
            ).count()
            services_accepted = ServiceRequest.query.filter(
                ServiceRequest.user_id == user.id,
                ServiceRequest.service_status == "accepted",
                ServiceRequest.date_of_request >= start_date,
                ServiceRequest.date_of_request < end_date
            ).count()
            services_rejected = ServiceRequest.query.filter(
                ServiceRequest.user_id == user.id,
                ServiceRequest.service_status == "rejected",
                ServiceRequest.date_of_request >= start_date,
                ServiceRequest.date_of_request < end_date
            ).count()

            # Generate the report content
            subject = "📊 Monthly Activity Report"
            body = f"""
            <h3>Hello {user.name},</h3>
            <p>Here is your activity report for the last month:</p>
            <ul>
                <li><strong>Services Requested:</strong> {services_requested}</li>
                <li><strong>Services Closed:</strong> {services_closed}</li>
                <li><strong>Services Pending:</strong> {services_pending}</li>
                <li><strong>Services Accepted:</strong> {services_accepted}</li>
                <li><strong>Services Rejected:</strong> {services_rejected}</li>
            </ul>
            <p>Thank you for using our services!</p>
            """

            # Send email
            send_email(user.email, subject, body)

        print(f"✅ Monthly activity reports sent to {len(users)} users.")
