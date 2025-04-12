from pydantic import BaseModel
from typing import List

class Patient(BaseModel):
    name: str
    gender: str
    note: str
    status: str
    age: int
    conditions: List[str] = []
    risk: str