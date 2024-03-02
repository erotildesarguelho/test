from pydantic import BaseModel
from typing import Optional

class EventoCampanha(BaseModel):
    id: int
    token: str
    franquia_token: str
    data_insert: str
    data_update: str
    titulo: str
    descricao: str
    dados: str
    status:bool

