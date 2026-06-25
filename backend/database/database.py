import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from . import csv_db

# Load .env from the backend/ directory (one level up from app/)
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_ENV_PATH)

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# We only create the client if the URL and KEY are provided to avoid crashes
_supabase_client = None
if url and key and key != "YOUR_SUPABASE_KEY_HERE":
    try:
        _supabase_client = create_client(url, key)
        # Quick test to verify connection
        try:
            _supabase_client.table("containers").select("*").limit(1).execute()
            supabase = _supabase_client
            print("[OK] Supabase connected successfully")
        except Exception as conn_error:
            print(f"[WARN] Supabase connection failed: {conn_error}")
            print("Using CSV fallback for database operations")
            supabase = None
    except Exception as e:
        print(f"[WARN] Failed to initialize Supabase: {e}")
        print("Using CSV fallback for database operations")
        supabase = None
else:
    supabase = None
    print(
        "[WARN] SUPABASE_URL or SUPABASE_KEY is missing. Using CSV fallback for database operations."
    )


# Provide fallback functions using CSV when Supabase is unavailable
class CSVDatabaseProxy:
    """Proxy that wraps CSV database operations with Supabase-like interface."""

    def table(self, table_name: str):
        """Mimic Supabase table() method."""
        return CSVTableProxy(table_name)


class CSVTableProxy:
    """Proxy for table operations."""

    def __init__(self, table_name: str):
        self.table_name = table_name
        self.query = {}
        self.filters = []
        self.records = []
        self.update_data = {}
        self._operation = None
        self._order_col = None
        self._order_desc = False
        self._range_start = None
        self._range_end = None
        self._count_mode = False

    def select(self, columns: str = "*", count: str = None):
        """Store select columns."""
        self.query["select"] = columns
        self._operation = "select"
        if count == "exact":
            self._count_mode = True
        return self

    def eq(self, column: str, value):
        """Add equality filter."""
        self.filters.append((column, "eq", value))
        return self

    def gt(self, column: str, value):
        """Add greater-than filter."""
        self.filters.append((column, "gt", value))
        return self

    def gte(self, column: str, value):
        """Add greater-than-or-equal filter."""
        self.filters.append((column, "gte", value))
        return self

    def lt(self, column: str, value):
        """Add less-than filter."""
        self.filters.append((column, "lt", value))
        return self

    def limit(self, count: int):
        """Store limit."""
        self.query["limit"] = count
        return self

    def offset(self, count: int):
        """Store offset."""
        self.query["offset"] = count
        return self

    def order(self, column: str, desc: bool = False):
        """Store ordering."""
        self._order_col = column
        self._order_desc = desc
        return self

    def range(self, start: int, end: int):
        """Store range for pagination."""
        self._range_start = start
        self._range_end = end
        return self

    def execute(self):
        """Execute the query against CSV backend."""
        if self._operation == "insert" or (self._operation in ("insert", "upsert") and self.records):
            if self.table_name == "containers":
                result_data = []
                for rec in self.records:
                    created = csv_db.create_container(rec)
                    result_data.append(created)
                return type("Response", (), {"data": result_data})()
            elif self.table_name == "risk_assessment":
                result_data = []
                for rec in self.records:
                    if rec.get("container_id"):
                        csv_db.save_risk_assessment(rec.get("container_id"), rec)
                    result_data.append(rec)
                return type("Response", (), {"data": result_data})()
            return type("Response", (), {"data": []})()

        if self.table_name == "containers":
            if self.filters and len(self.filters) > 0:
                # Filter by container_id (or container_id)
                for col, op, val in self.filters:
                    if col in ("container_id", "Container_ID"):
                        # Getting single container
                        container = csv_db.get_container(val)
                        return type(
                            "Response", (), {"data": [container] if container else []}
                        )()
            else:
                # Getting multiple containers
                limit = self.query.get("limit", 100)
                offset = self.query.get("offset", 0)
                if self._range_start is not None:
                    offset = self._range_start
                    limit = (self._range_end or self._range_start) - self._range_start + 1
                result = csv_db.get_all_containers(limit, offset)
                resp = type(
                    "Response", (), {"data": result["data"], "count": result["count"]}
                )()
                return resp

        # For risk_assessment and other tables, return empty
        return type("Response", (), {"data": [], "count": 0})()

    def insert(self, records):
        """Handle inserts."""
        self.records = records if isinstance(records, list) else [records]
        self._operation = "insert"
        return self

    def upsert(self, records):
        """Handle upserts."""
        self.records = records if isinstance(records, list) else [records]
        self._operation = "upsert"
        return self

    def update(self, data):
        """Store update data."""
        self.update_data = data
        self._operation = "update"
        return self


# Use Supabase if available, otherwise use CSV fallback
if supabase is None:
    supabase = CSVDatabaseProxy()
