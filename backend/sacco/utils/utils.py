import pywhatkit as kit
import datetime
import time
from django.core.mail import send_mail

def send_otp_email(email, otp_code):
    subject = "Password Reset OTP"
    message = f"Your OTP code is: {otp_code}"
    from_email = "no-reply@sacco.com"
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)

def send_otp_whatsapp(phone_number, otp_code):
    if not phone_number.startswith("+254"):
        phone_number = "+254" + phone_number[-9:]

    message = f"Your OTP for password reset is: {otp_code}"
    now = datetime.datetime.now() + datetime.timedelta(minutes=1)
    hour = now.hour
    minute = now.minute

    try:
        kit.sendwhatmsg(phone_number, message, hour, minute)
        time.sleep(10)
        return True
    except Exception as e:
        print(f"WhatsApp send error: {e}")
        return False


import random

def generate_otp():
    return f"{random.randint(100000, 999999)}"
