from pydantic import BaseModel
from typing import Optional

class userReqMod(BaseModel):
    email: str
    password: str
    username: Optional[str] = None

class userResMod(BaseModel):
    error: bool
    token: str
    username: Optional[str] = None
