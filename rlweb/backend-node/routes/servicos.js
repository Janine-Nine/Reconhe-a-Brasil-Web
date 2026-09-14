const express = require("express");
const { pool } = require("../db");

const router = express.Router();

/* GET /api/servicos — lista todos os pacotes de serviço */
router.get("/", async (req, res) => {
    try {
        const [servicos] = await pool.query(
            "SELECT id, nome, preco, descricao, destaque FROM servicos ORDER BY preco ASC"
        );

        const [itens] = await pool.query("SELECT servico_id, descricao FROM servico_itens ORDER BY id ASC");

        const resultado = servicos.map((s) => ({
            ...s,
            destaque: !!s.destaque,
            itens: itens.filter((i) => i.servico_id === s.id).map((i) => i.descricao),
        }));

        res.json(resultado);
    } catch (erro) {
        console.error("[servicos] erro ao listar:", erro.message);
        res.status(500).json({ erro: "Não foi possível carregar os serviços." });
    }
});

module.exports = router;
