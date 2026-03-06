import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env from the backend/ directory (one level up from app/)
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_ENV_PATH)

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# We only create the client if the URL and KEY are provided to avoid crashes
if url and key and key != "YOUR_SUPABASE_KEY_HERE":
    supabase: Client = create_client(url, key)
else:
    supabase = None
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing. Database operations will fail.")
