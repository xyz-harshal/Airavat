from fastapi import APIRouter, HTTPException
import os
import json

router = APIRouter()

@router.get('/data')
def get_brain_data():
    """
    Send brain data generated from MNE Python for 3D visualization.
    Returns the brain data as JSON.
    """
    try:
        # Path to the brain data JSON file
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'utils', 'brain_data.json')
        
        if not os.path.exists(data_path):
            raise HTTPException(status_code=404, detail="Brain data not found")
            
        with open(data_path, 'r') as f:
            data = json.load(f)
            
        return data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/generate')
def generate_brain_data():
    """
    Trigger regeneration of brain data (for future use).
    Currently just returns existing data.
    """
    try:
        # TODO: In the future, this could trigger regeneration with custom parameters
        # For now, just return the existing brain data
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'utils', 'brain_data.json')
        
        if not os.path.exists(data_path):
            raise HTTPException(status_code=404, detail="Brain data not found")
            
        return {"message": "Using existing brain data", "data_path": data_path}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
