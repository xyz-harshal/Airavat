# FastAPI Server Code Generation Guidelines

This document provides strict instructions for LLM models to generate code for the FastAPI server project. Follow these guidelines precisely to maintain consistency and proper project structure.

## Project Structure

Maintain the following directory structure strictly:
```
- auth.py
- copilot-instructions.md
- main.py
- readme.md
- requirement.txt
- .env
- __pycache__/
- models/
    - __init__.py
    - <new_model_file>.py
- routes/
    - __init__.py
    - <new_route_file>.py
```

### File Descriptions

1. **main.py**
   - This file imports all the routes from the `routes` directory.
   - Ensures all routes are properly registered with the FastAPI app instance.
   - Configures CORS middleware for cross-origin requests.
   - Loads environment variables using `python-dotenv`.

2. **auth.py**
   - Handles authentication logic including password hashing and verification.
   - Implements JWT token encoding and decoding functions.
   - Uses `passlib` for password hashing and `jose` for JWT operations.

3. **.env**
   - Contains environment variables for:
     - Supabase URL and API keys (anon and service role)
     - Secret key for JWT encoding/decoding
     - Algorithm specification for JWT

4. **models/**
   - Each new set of routes must have a corresponding model file in this directory.
   - The model files should use Pydantic BaseModel for request/response validation.
   - Include proper type annotations and optional fields where appropriate.

5. **routes/**
   - Maintain a modular structure for all routes.
   - Each route file must follow the code template of `routes/userRoute.py`.
   - Ensure proper error handling and appropriate HTTP status codes.
   - Always use Supabase service role client when available for database operations.

## Code Generation Norms

- **Simplicity**: The generated code must be concise and workable.
- **Error Handling**: Include proper error handling with try/except blocks.
- **Best Practices**: Follow industry best practices for FastAPI development.
- **No Excess Code**: Avoid generating unnecessary or redundant code.
- **Documentation**: Add clear and concise docstrings for all functions and classes.
- **Type Annotations**: Use type annotations for all function arguments and return types.
- **Environment Variables**: Validate and handle missing environment variables gracefully.
- **Security**: Ensure secure handling of sensitive data, such as passwords and API keys.
- **Testing**: Include unit tests for critical functions and routes.

## Supabase Integration

Always implement Supabase client connections following this pattern:

```python
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
service_supabase = None
if SUPABASE_SERVICE_KEY:
    service_supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
```

When making database queries, prefer the service role client when available:
```python
client = service_supabase if service_supabase else supabase
response = client.table("table_name").select("...").execute()
```

## Route Code Template

All generated route files must adhere to the following template:

```python
from fastapi import APIRouter, HTTPException
import os
from supabase import create_client, Client

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

@router.get("/example")
async def example_route():
    """Example route to demonstrate the template."""
    try:
        client = service_supabase if service_supabase else supabase
        # Your logic here
        return {"message": "Example route"}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

## Example: `routes/userRoute.py`

Below is the current implementation of the user routes that must be followed for all new route files:

```python
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
```

## Model Pattern

Follow this pattern for model files:

```python
from pydantic import BaseModel
from typing import Optional

class ExampleRequestModel(BaseModel):
    required_field: str
    another_field: str
    optional_field: Optional[str] = None

class ExampleResponseModel(BaseModel):
    error: bool
    data: Optional[dict] = None
    message: Optional[str] = None
```

## Environment Variables

Ensure all projects include these environment variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
```

## cURL Command Generation

For every route generated, provide a corresponding cURL command to test the route. For example:

```bash
# Example login request
curl -X POST "http://127.0.0.1:8000/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Example register request
curl -X POST "http://127.0.0.1:8000/user/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "password123", "username": "newuser"}'
```

## Final Note

Adhere to these guidelines strictly to ensure consistency, maintainability, and quality of the FastAPI server project. All code should be compatible with Python 3.8 or higher and follow the patterns established in the existing codebase.
