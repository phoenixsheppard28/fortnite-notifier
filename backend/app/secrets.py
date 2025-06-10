from dotenv import load_dotenv
import os

load_dotenv()

class Secrets:
    FN_API_KEY=os.getenv("FN_API_KEY")
    DB_STRING=os.getenv("DB_STRING")
    TELEGRAM_TOKEN=os.getenv("TELEGRAM_TOKEN")