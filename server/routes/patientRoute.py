from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
from pydantic import BaseModel
from typing import List, Optional

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

class Patient(BaseModel):
    name: str
    gender: str
    note: Optional[str] = None
    status: str
    age: int
    conditions: List[str] = []
    risk: str
    uid: str

class PatientResponse(BaseModel):
    error: bool
    data: Optional[List[Patient]] = None
    message: Optional[str] = None

@router.get("/patients", response_model=PatientResponse)
async def get_all_patients():
    """Get all patients from the database"""
    try:
        client = service_supabase if service_supabase else supabase
        response = client.table("patients").select("*").execute()
        
        if not response.data:
            return {"error": False, "data": [], "message": "No patients found"}
            
        return {"error": False, "data": response.data, "message": "Patients retrieved successfully"}
    except Exception as e:
        print(f"Error retrieving patients: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/patients")
async def create_patient(patient: Patient):
    try:
        client = service_supabase if service_supabase else supabase
        patient_data = patient.dict()

        if not patient_data.get("uid"):
            raise HTTPException(status_code=400, detail="UID is required")

        response = client.table("patients").insert(patient_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create patient record")

        return {"message": "Patient record created successfully", "data": response.data}
    except Exception as e:
        print(f"Error creating patient record: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")