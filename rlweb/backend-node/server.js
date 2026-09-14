require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { aguardarBancoDeDados } = require("./db");
const rotasProjetos = require("./routes/projetos");
const rotasServicos = require("./routes/servicos");
const rotasContato = require("./routes/contato");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", servico: "backend-node" }));

app.use("/api/projetos", rotasProjetos);
app.use("/api/servicos", rotasServicos);
app.use("/api/contato", rotasContato);

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada." });
});

// Tratador de erros genérico
app.use((erro, req, res, next) => {
    console.error("[server] erro não tratado:", erro);
    res.status(500).json({ erro: "Erro interno do servidor." });
});

async function iniciar() {
    await aguardarBancoDeDados();
    app.listen(PORT, () => {
        console.log(`[server] Reconheça Brasil Web API rodando na porta ${PORT}`);
    });
}

iniciar().catch((erro) => {
    console.error("[server] falha ao iniciar:", erro);
    process.exit(1);
});
