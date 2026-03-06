import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# We only create the client if the URL and KEY are provided to avoid crashes
if url and key and key != "YOUR_SUPABASE_KEY_HERE":
    supabase: Client = create_client(url, key)
else:
    supabase = None
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing. Database operations will fail.")
