from fastapi import FastAPI, HTTPException, Request,Response,Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordBearer
import json

# from controller.login import LoginController


app = FastAPI(title=f"Api de B2XBET", version="1.0")

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configurações de CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# @app.post("/usuario/login")
# async def login(request: Request):

#     data = await request.json()

#     email = data["email"]
#     password = data["password"]
    
#     token,mensagem = LoginController.login(email, password)

#     return {
#         "status": True,
#         "token": token,
#         "mensagem": mensagem
#     }

# @app.post("/usuario/verifica_token")
# async def verifica_token(token: str = Depends(oauth2_scheme)):
#     print("Token recebido:", token)
#     return {"mensagem": "Token verificado com sucesso"}

#     pass

@app.post("/server")
async def login(request: Request):

    data = await request.json()

    print(data)

    return {
        "status": True,
        "Version": 7.0,
        "Api": "Api Usuário"
    }

@app.get("/status")
async def status():

    import time

    time.sleep(1)

    # LoginController.status()

    return {
        "status": True,
        "Version": 7.0,
        "Api": "Api Usuário"
    }

