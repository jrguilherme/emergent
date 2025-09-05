from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
import uuid
from datetime import datetime
import re


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Mensura Maat API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    service: Optional[str] = Field(None, max_length=100)
    message: str = Field(..., min_length=10, max_length=1000)
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Nome não pode estar vazio')
        return v.strip()
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and v.strip():
            # Basic phone validation - allow Brazilian format
            phone_pattern = r'^[\(\)\+\-\s\d]+$'
            if not re.match(phone_pattern, v.strip()):
                raise ValueError('Telefone inválido')
            return v.strip()
        return None
    
    @validator('message')
    def validate_message(cls, v):
        if not v.strip():
            raise ValueError('Mensagem não pode estar vazia')
        return v.strip()

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str]
    service: Optional[str]
    message: str
    status: str = Field(default="new")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ContactResponse(BaseModel):
    success: bool
    message: str
    contact_id: Optional[str] = None

class ContactsListResponse(BaseModel):
    success: bool
    contacts: List[Contact]
    total: int

class StatsResponse(BaseModel):
    total_contacts: int
    contacts_this_month: int
    popular_services: List[dict]

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Mensura Maat API - Online", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Contact Routes
@api_router.post("/contacts", response_model=ContactResponse)
async def create_contact(contact_data: ContactCreate):
    try:
        # Create contact object
        contact = Contact(
            name=contact_data.name,
            email=contact_data.email,
            phone=contact_data.phone,
            service=contact_data.service,
            message=contact_data.message
        )
        
        # Save to database
        result = await db.contacts.insert_one(contact.dict())
        
        if result.inserted_id:
            logger.info(f"New contact created: {contact.email}")
            return ContactResponse(
                success=True,
                message="Contato enviado com sucesso! Entraremos em contato em breve.",
                contact_id=contact.id
            )
        else:
            raise HTTPException(status_code=500, detail="Erro ao salvar contato")
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating contact: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Erro interno do servidor. Tente novamente ou entre em contato via WhatsApp."
        )

@api_router.get("/contacts", response_model=ContactsListResponse)
async def get_contacts(skip: int = 0, limit: int = 50):
    """Get all contacts - for admin use"""
    try:
        # Get total count
        total = await db.contacts.count_documents({})
        
        # Get contacts with pagination
        contacts_cursor = db.contacts.find().sort("created_at", -1).skip(skip).limit(limit)
        contacts_list = await contacts_cursor.to_list(limit)
        
        contacts = [Contact(**contact) for contact in contacts_list]
        
        return ContactsListResponse(
            success=True,
            contacts=contacts,
            total=total
        )
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao buscar contatos")

@api_router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get basic statistics about contacts"""
    try:
        # Total contacts
        total_contacts = await db.contacts.count_documents({})
        
        # Contacts this month
        from datetime import datetime, timedelta
        start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        contacts_this_month = await db.contacts.count_documents({
            "created_at": {"$gte": start_of_month}
        })
        
        # Popular services
        pipeline = [
            {"$match": {"service": {"$ne": None, "$ne": ""}}},
            {"$group": {"_id": "$service", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5},
            {"$project": {"service": "$_id", "count": 1, "_id": 0}}
        ]
        
        popular_services_cursor = db.contacts.aggregate(pipeline)
        popular_services = await popular_services_cursor.to_list(5)
        
        return StatsResponse(
            total_contacts=total_contacts,
            contacts_this_month=contacts_this_month,
            popular_services=popular_services
        )
    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao buscar estatísticas")

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
