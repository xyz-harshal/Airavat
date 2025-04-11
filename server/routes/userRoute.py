from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from auth import hashed_pass, verify_hash_pass
from models import userReqMod, userResMod

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
service_supabase = None
if SUPABASE_SERVICE_KEY:
    service_supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

@router.post("/login", response_model=userResMod)
async def login(req: userReqMod):
    try:
        client = service_supabase if service_supabase else supabase
        response = client.table("users").select("uid, password, username").eq("email", req.email).execute()
        
        if not response.data or len(response.data) == 0:
            return {"error": True, "token": "", "username": ""}
        
        user = response.data[0]
        if not verify_hash_pass(req.password, user["password"]):
            return {"error": True, "token": "", "username": ""}

        return {"error": False, "token": user["uid"], "username": user["username"]}
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/register", response_model=userResMod)
async def register(req: userReqMod):
    try:
        if not req.username:
            return {"error": True, "token": "", "username": ""}

        client = service_supabase if service_supabase else supabase
        response = client.table("users").select("uid").eq("email", req.email).execute()
        
        if response.data and len(response.data) > 0:
            return {"error": True, "token": "", "username": ""}
        
        hash_pass = hashed_pass(req.password)
        user_id = str(uuid.uuid4())
        
        response = client.table("users").insert({
            "uid": user_id,
            "email": req.email,
            "password": hash_pass,
            "username": req.username
        }).execute()
        
        if not response.data:
            return {"error": True, "token": "", "username": ""}
            
        return {"error": False, "token": user_id, "username": req.username}
    except Exception as e:
        print(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")