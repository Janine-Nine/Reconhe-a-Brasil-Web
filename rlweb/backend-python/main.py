"""
Reconheça Brasil Web — microsserviço Python (FastAPI)

Responsável por processar notificações do formulário de contato
(envio de e-mail) de forma desacoplada da API principal em Node.js.
"""

import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

from mailer import enviar_notificacao, smtp_configurado

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rbweb.python")

app = FastAPI(
    title="Reconheça Brasil Web - Serviço Python",
    description="Microsserviço de notificações (e-mail) do formulário de contato.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContatoRequest(BaseModel):
    nome: str = Field(min_length=1, max_length=150)
    email: EmailStr
    assunto: str | None = Field(default=None, max_length=200)
    mensagem: str = Field(min_length=1)


@app.get("/health")
def health():
    return {"status": "ok", "servico": "backend-python", "smtp_configurado": smtp_configurado()}


@app.post("/notificar")
def notificar(dados: ContatoRequest):
    try:
        resultado = enviar_notificacao(dados.nome, dados.email, dados.assunto or "", dados.mensagem)
        return {"status": "processado", **resultado}
    except Exception as erro:
        logger.exception("Erro ao processar notificação")
        raise HTTPException(status_code=500, detail="Não foi possível processar a notificação.") from erro
