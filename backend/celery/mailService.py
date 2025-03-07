import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


SMTP_SERVER = "localhost"
SMTP_PORT=1025
SENDER_EMAIL = "sender @example.com"
SENDER_PASSWORD = ""


def send_email(to, subject, content):
    msg= MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL

    msg.attach(MIMEText(content, 'html'))

    with smtplib.SMTP(host= SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        print(f"Email sent to {to}")
        client.quit()

# send_email("recipient@example.com", "Test Email", "<h1>Hello World!</h1>") just an example usage. 
#we will have to import our db and send personalized emails.
