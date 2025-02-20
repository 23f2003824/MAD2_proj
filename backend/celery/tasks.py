from celery import shared_task
from backend.models import db, Service
import flask_excel


@shared_task(ignore_result=False) #by default it is also false, we want it to be true
def add(x, y):
    return x + y

@shared_task(bind=True,ignore_result=False)
def db_to_csv(self):
    resource= Service.query.all()
    # get task id to be used as filename for the downloaded file hence creating unique filename

    task_id= self.request.id
    filename= f'services_data_{task_id}.csv'
    
    column_names= [column.name for column in Service.__table__.columns]
    csv_out= flask_excel.make_response_from_query_sets(resource, column_names=column_names, file_type='csv')

    with open(f'./backend/celery/user_downloads/{filename}', 'wb') as file: #path should be relative to app.py
        file.write(csv_out.data)

    return filename # return filename for the downloaded file to be used in routes.py to serve the file to the user.