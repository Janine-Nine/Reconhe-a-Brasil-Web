const express = require("express");
const { pool } = require("../db");

const router = express.Router();

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://backend-python:8000";

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* POST /api/contato — grava a mensagem e dispara notificação por e-mail */
router.post("/", async (req, res) => {
    const { nome, email, assunto, mensagem } = req.body || {};

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ erro: "Nome, e-mail e mensagem são obrigatórios." });
    }
    if (!validarEmail(email)) {
        return res.status(400).json({ erro: "Informe um e-mail válido." });
    }

    try {
        const [resultado] = await pool.query(
            "INSERT INTO contatos (nome, email, assunto, mensagem) VALUES (?, ?, ?, ?)",
            [nome.trim(), email.trim(), (assunto || "").trim(), mensagem.trim()]
        );

        // Dispara a notificação para o microsserviço Python de forma assíncrona.
        // Se o serviço de e-mail falhar, o contato já foi salvo no banco mesmo assim.
        notificarServicoPython({ nome, email, assunto, mensagem }).catch((erro) => {
            console.warn("[contato] falha ao notificar serviço Python:", erro.message);
        });

        res.status(201).json({ mensagem: "Contato recebido com sucesso.", id: resultado.insertId });
    } catch (erro) {
        console.error("[contato] erro ao salvar:", erro.message);
        res.status(500).json({ erro: "Não foi possível registrar seu contato agora." });
    }
});

async function notificarServicoPython(dados) {
    const resposta = await fetch(`${PYTHON_SERVICE_URL}/notificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
        signal: AbortSignal.timeout(5000),
    });

    if (!resposta.ok) {
        throw new Error(`serviço Python retornou status ${resposta.status}`);
    }
}

module.exports = router;
