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
    id: str
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

class EegAnalysisRequest(BaseModel):
    patient_ids: List[str]
    analysis_type: str
    user_id: str

class EegAnalysisResponse(BaseModel):
    error: bool
    data: Optional[dict] = None
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

@router.post("/patients/analyze-eeg", response_model=EegAnalysisResponse)
async def analyze_multiple_patients_eeg(request: EegAnalysisRequest):
    """Analyze EEG data for multiple patients"""
    try:
        client = service_supabase if service_supabase else supabase
        
        # Validate that we have at least one patient ID
        if not request.patient_ids or len(request.patient_ids) == 0:
            return {"error": True, "message": "At least one patient ID is required"}
            
        # Verify all patients exist and belong to the user
        for patient_id in request.patient_ids:
            patient_response = client.table("patients").select("*").eq("id", patient_id).eq("uid", request.user_id).execute()
            if not patient_response.data or len(patient_response.data) == 0:
                return {"error": True, "message": f"Patient with ID {patient_id} not found or does not belong to the user"}
        
        # In a real implementation, this would initiate EEG analysis for each patient
        # For now, we'll just return a success message with the patients that would be analyzed
        
        return {
            "error": False, 
            "data": {
                "analysis_id": "eeg-analysis-123", # This would be a real ID in production
                "patient_ids": request.patient_ids,
                "analysis_type": request.analysis_type,
                "status": "processing"
            },
            "message": f"EEG analysis started for {len(request.patient_ids)} patients"
        }
    except Exception as e:
        print(f"Error analyzing patients' EEG data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")