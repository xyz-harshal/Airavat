from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
import os
import uuid
from pydantic import BaseModel
from typing import List, Optional
from models.patientModel import Patient

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
        print(f"Received patient data: {patient_data}")

        if not patient_data.get("uid"):
            raise HTTPException(status_code=400, detail="UID is required")

        # The id should be auto-generated if not provided
        if not patient_data.get("id"):
            patient_data["id"] = str(uuid.uuid4())

        # Ensure conditions is a list
        if patient_data.get("conditions") is None:
            patient_data["conditions"] = []
        
        # Convert age to int if it's a string
        if isinstance(patient_data.get("age"), str):
            try:
                patient_data["age"] = int(patient_data["age"])
            except ValueError:
                raise HTTPException(status_code=400, detail="Age must be a valid number")

        # Convert gender to lowercase for consistency
        if patient_data.get("gender"):
            patient_data["gender"] = patient_data["gender"].lower()

        # Ensure status is valid
        if patient_data.get("status"):
            patient_data["status"] = patient_data["status"].lower()

        response = client.table("patients").insert(patient_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create patient record")

        return {"error": False, "message": "Patient record created successfully", "data": response.data[0]}
    except Exception as e:
        print(f"Error creating patient record: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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

@router.post("/patients/save-analysis")
async def save_patient_analysis(request: dict):
    """Save EEG analysis data for a specific patient"""
    try:
        client = service_supabase if service_supabase else supabase
        
        # Required fields
        patient_id = request.get("patient_id")
        user_id = request.get("user_id")
        
        if not patient_id or not user_id:
            raise HTTPException(status_code=400, detail="Patient ID and User ID are required")
        
        # Get the analysis data
        raw_predictions = request.get("raw_predictions")
        condition_probabilities = request.get("condition_probabilities")
        medication = request.get("medication")
        ai_content = request.get("ai_content")
        
        # Verify the patient exists and belongs to the user
        patient_response = client.table("patients").select("*").eq("id", patient_id).eq("uid", user_id).execute()
        
        if not patient_response.data or len(patient_response.data) == 0:
            return {"error": True, "message": f"Patient with ID {patient_id} not found or does not belong to the user"}
        
        # Update the patient record with the analysis data
        update_data = {}
        if raw_predictions is not None:
            update_data["raw_predictions"] = raw_predictions
        if condition_probabilities is not None:
            update_data["condition_probabilities"] = condition_probabilities
        if medication is not None:
            update_data["medication"] = medication
        if ai_content is not None:
            update_data["ai_content"] = ai_content
        
        # Only update if we have data to update
        if update_data:
            update_response = client.table("patients").update(update_data).eq("id", patient_id).eq("uid", user_id).execute()
            
            if not update_response.data:
                return {"error": True, "message": "Failed to update patient record"}
            
            return {
                "error": False, 
                "message": "Patient analysis data saved successfully",
                "data": update_response.data[0]
            }
        else:
            return {"error": True, "message": "No analysis data provided to save"}
            
    except Exception as e:
        print(f"Error saving patient analysis data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/patients/save-analysis-by-name")
async def save_patient_analysis_by_name(request: dict):
    """Save EEG analysis data for a specific patient using their name"""
    try:
        client = service_supabase if service_supabase else supabase
        
        # Required fields
        patient_name = request.get("patient_name")
        user_id = request.get("user_id")
        
        if not patient_name or not user_id:
            raise HTTPException(status_code=400, detail="Patient name and User ID are required")
        
        # Get the analysis data
        raw_predictions = request.get("raw_predictions")
        condition_probabilities = request.get("condition_probabilities")
        medication = request.get("medication")
        ai_content = request.get("ai_content")
        print(request)
        
        # Verify the patient exists and belongs to the user
        patient_response = client.table("patients").select("*").eq("name", patient_name).eq("uid", user_id).execute()
        
        if not patient_response.data or len(patient_response.data) == 0:
            return {"error": True, "message": f"Patient with name '{patient_name}' not found or does not belong to the user"}
        
        # Get the first matching patient (assuming names are unique per user)
        patient = patient_response.data[0]
        patient_id = patient["id"]
        
        # Update the patient record with the analysis data
        update_data = {}
        if raw_predictions is not None:
            update_data["raw_predictions"] = raw_predictions
        if condition_probabilities is not None:
            update_data["condition_probabilities"] = condition_probabilities
        if medication is not None:
            update_data["medication"] = medication
        if ai_content is not None:
            update_data["ai_content"] = ai_content
        
        # Only update if we have data to update
        if update_data:
            update_response = client.table("patients").update(update_data).eq("id", patient_id).eq("uid", user_id).execute()
            
            if not update_response.data:
                return {"error": True, "message": "Failed to update patient record"}
            
            return {
                "error": False, 
                "message": "Patient analysis data saved successfully",
                "data": update_response.data[0]
            }
        else:
            return {"error": True, "message": "No analysis data provided to save"}
            
    except Exception as e:
        print(f"Error saving patient analysis data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")