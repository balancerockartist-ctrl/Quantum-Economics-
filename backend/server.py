from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from urllib.parse import quote


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ── Store Models ──────────────────────────────────────────────────────────────

class StoreItem(BaseModel):
    id: str
    name: str
    description: str
    category: str
    price: float = 0.0

class GeneratePaymentUrlRequest(BaseModel):
    recipient: str
    amount: float = 0.0
    label: str = "FreePay"
    message: str = ""
    memo: str = ""

class GeneratePaymentUrlResponse(BaseModel):
    url: str
    reference: str

class IPAsset(BaseModel):
    id: str
    name: str
    description: str
    estimated_value: float
    token_symbol: str

class CreditLineResponse(BaseModel):
    ip_assets: List[IPAsset]
    total_credit: float
    available_credit: float
    receivables_stream: float

# ── Store Routes ───────────────────────────────────────────────────────────────

STORE_ITEMS = [
    StoreItem(id="1", name="Quantum Economics Whitepaper", description="Full PDF of the Quantum Economics framework and theory", category="Document", price=0.0),
    StoreItem(id="2", name="Blue Star v2026 Beat Pack", description="Exclusive lo-fi + quantum-wave music collection (10 tracks)", category="Music", price=0.0),
    StoreItem(id="3", name="GOS System Starter Kit", description="Digital toolkit for the Godworld Operating System bootstrap", category="Software", price=0.0),
    StoreItem(id="4", name="Claudia AI Prompt Library", description="Curated prompt collection for advanced AI workflows", category="AI Tools", price=0.0),
    StoreItem(id="5", name="Quantum Art Genesis Pack", description="Generative art collection: 5 original SVG pieces by Godworld artists", category="Art", price=0.0),
]

IP_ASSETS = [
    IPAsset(id="ip-1", name="Quantum Economics IP", description="Core IP for Quantum Economics theory and framework", estimated_value=250000.0, token_symbol="QEI"),
    IPAsset(id="ip-2", name="Blue Star v2026 Code", description="Proprietary music generation algorithm and compositions", estimated_value=75000.0, token_symbol="BSC"),
    IPAsset(id="ip-3", name="GOS System", description="Godworld Operating System architecture and source code", estimated_value=180000.0, token_symbol="GOS"),
    IPAsset(id="ip-4", name="Claudia AI", description="AI assistant training data, prompts, and fine-tuning corpus", estimated_value=120000.0, token_symbol="CAI"),
]

@api_router.get("/store/items", response_model=List[StoreItem])
async def get_store_items():
    return STORE_ITEMS

@api_router.post("/store/generate-payment-url", response_model=GeneratePaymentUrlResponse)
async def generate_payment_url(req: GeneratePaymentUrlRequest):
    reference = str(uuid.uuid4())
    params = f"?amount={req.amount}"
    if req.label:
        params += f"&label={quote(req.label)}"
    if req.message:
        params += f"&message={quote(req.message)}"
    if req.memo:
        params += f"&memo={quote(req.memo)}"
    params += f"&reference={reference}"
    url = f"solana:{req.recipient}{params}"
    return GeneratePaymentUrlResponse(url=url, reference=reference)

@api_router.get("/store/credit-line", response_model=CreditLineResponse)
async def get_credit_line():
    total = sum(a.estimated_value for a in IP_ASSETS)
    return CreditLineResponse(
        ip_assets=IP_ASSETS,
        total_credit=total * 0.6,
        available_credit=total * 0.6 * 0.8,
        receivables_stream=1420.50,
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()