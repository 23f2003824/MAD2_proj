from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_notification, send_daily_reminders
from backend.models import db, User, ServiceRequest

celery_app= app.extensions["celery"]

#need to re run scheduler if any changes are made to this file


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=7, minute=30),
        send_daily_reminders.s(),  # ✅ Corrected task reference!
        name="Send daily service request reminders to professionals"
    )


celery_app.conf.beat_schedule.update({
    "send-monthly-report": {
        "task": "backend.celery.tasks.send_monthly_activity_report",
        "schedule": crontab(hour=8, minute=0, day_of_month=1),  # Runs at 8:00 AM on the 1st of every month
    },
})



    


