"""
Módulo responsável por notificar a equipe quando um novo contato chega
pelo site. Usa SMTP se as variáveis de ambiente estiverem configuradas;
caso contrário, apenas registra a mensagem no log (modo desenvolvimento),
para que o projeto funcione de ponta a ponta sem exigir credenciais reais.
"""

import logging
import os
import smtplib
from email.message import EmailMessage

logger = logging.getLogger("rbweb.mailer")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_DESTINO = os.getenv("EMAIL_DESTINO", "contato@reconhecabrasilweb.com.br")


def smtp_configurado() -> bool:
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASSWORD)


def enviar_notificacao(nome: str, email: str, assunto: str, mensagem: str) -> dict:
    """Envia (ou simula o envio de) um e-mail de notificação de novo contato."""

    corpo = (
        f"Novo contato recebido pelo site Reconheça Brasil Web\n\n"
        f"Nome: {nome}\n"
        f"E-mail: {email}\n"
        f"Assunto: {assunto or '(não informado)'}\n\n"
        f"Mensagem:\n{mensagem}\n"
    )

    if not smtp_configurado():
        logger.info("[mailer] SMTP não configurado — simulando envio de e-mail.\n%s", corpo)
        return {"enviado": False, "modo": "simulado"}

    try:
        msg = EmailMessage()
        msg["Subject"] = f"Novo contato: {assunto or 'Site Reconheça Brasil Web'}"
        msg["From"] = SMTP_USER
        msg["To"] = EMAIL_DESTINO
        msg["Reply-To"] = email
        msg.set_content(corpo)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as servidor:
            servidor.starttls()
            servidor.login(SMTP_USER, SMTP_PASSWORD)
            servidor.send_message(msg)

        logger.info("[mailer] e-mail enviado com sucesso para %s", EMAIL_DESTINO)
        return {"enviado": True, "modo": "smtp"}
    except Exception as erro:
        logger.error("[mailer] falha ao enviar e-mail: %s", erro)
        return {"enviado": False, "modo": "erro", "detalhe": str(erro)}
