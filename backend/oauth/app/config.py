import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Retrieve variables
CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
