import requests

url_signup = "http://127.0.0.1:8000/api/auth/signup"
url_login = "http://127.0.0.1:8000/api/auth/login"

# Generate a unique email
import random
email = f"test_{random.randint(1000, 9999)}@example.com"

print(f"Testing signup with email: {email}")
payload = {
    "fullName": "Test User",
    "email": email,
    "password": "password123"
}

r = requests.post(url_signup, json=payload)
print(f"Signup response status: {r.status_code}")
print(f"Signup response JSON: {r.json()}")

print("\nTesting login...")
payload_login = {
    "email": email,
    "password": "password123"
}
r_login = requests.post(url_login, json=payload_login)
print(f"Login response status: {r_login.status_code}")
print(f"Login response JSON: {r_login.json()}")
