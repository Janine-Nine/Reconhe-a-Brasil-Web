const express = require("express");
const { pool } = require("../db");

const router = express.Router();

/* GET /api/projetos — lista todos os projetos */
router.get("/", async (req, res) => {
    try {
        const [linhas] = await pool.query(
            "SELECT id, titulo, descricao, imagem, categoria, destaque FROM projetos ORDER BY criado_em DESC"
        );
        const projetos = linhas.map((p) => ({ ...p, destaque: !!p.destaque }));
        res.json(projetos);
    } catch (erro) {
        console.error("[projetos] erro ao listar:", erro.message);
        res.status(500).json({ erro: "Não foi possível carregar os projetos." });
    }
});

/* GET /api/projetos/:id — detalhe de um projeto */
router.get("/:id", async (req, res) => {
    try {
        const [linhas] = await pool.query("SELECT * FROM projetos WHERE id = ?", [req.params.id]);
        if (!linhas.length) return res.status(404).json({ erro: "Projeto não encontrado." });
        res.json({ ...linhas[0], destaque: !!linhas[0].destaque });
    } catch (erro) {
        console.error("[projetos] erro ao buscar:", erro.message);
        res.status(500).json({ erro: "Não foi possível carregar o projeto." });
    }
});

module.exports = router;
