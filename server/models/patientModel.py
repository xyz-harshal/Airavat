from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

class Patient(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    gender: str
    note: Optional[str] = None
    status: str
    age: int
    conditions: List[str] = []
    risk: str
    uid: str