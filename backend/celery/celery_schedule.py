from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_notification

celery_app= app.extensions["celery"]

#need to re run scheduler if any changes are made to this file
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # sender.add_periodic_task(30.0, test.s('hello'), name='add every 30')

    # # Calls test('world') every 30 seconds
    # sender.add_periodic_task(30.0, test.s('world'), expires=10)

    # # Executes every Monday morning at 7:30 a.m.
    # sender.add_periodic_task(
    #     crontab(hour=7, minute=30, day_of_week=1),
    #     test.s('Happy Mondays!'),
    # )

    #send email every 10 seconds to a specific email address
    # sender.add_periodic_task(10.0, email_notification.s('student@example.com', 'Email testing', '<h1>Hello! everyone</h1>'), name='testing mail every 10 seconds')

    sender.add_periodic_task(crontab(hour=19, minute=30), #will send email at 7:30 PM every day.
                             email_notification.s('student@example.com', 'Email testing', '<h1>Hello! everyone</h1>'), name='testing mail to send every day at 7:30 PM')
    

@celery_app.task
def test(arg):
    print(arg)
