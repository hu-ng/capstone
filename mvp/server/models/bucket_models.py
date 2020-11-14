from pydantic import BaseModel, UUID4
from typing import Optional

class Bucket(BaseModel):
    name: str
    frequency: str
    user_id: Optional[UUID4]


class BucketIn(Bucket):
    pass


class BucketOut(Bucket):
    id: str


class BucketUpdate(BaseModel):
    name: str
    frequency: str