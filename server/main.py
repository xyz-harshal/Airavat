from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.userRoute import router as auth_router
from routes.patientRoute import router as patient_router
from dotenv import load_dotenv
from routes.chatRoute import router as chat_router
from routes.brainRoute import router as brain_router

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(patient_router, prefix="/api")
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(brain_router, prefix="/api/brain", tags=["brain"])

@app.get("/")
def home():
    return {"message": "Welcome to the API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
