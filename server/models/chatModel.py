from pydantic import BaseModel

class ChatRequestModel(BaseModel):
    message: str

class ChatResponseModel(BaseModel):
    error: bool
    response: str