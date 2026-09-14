const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "mysql",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "rbweb_user",
    password: process.env.DB_PASSWORD || "rbweb_pass",
    database: process.env.DB_NAME || "reconheca_brasil_web",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
});

/**
 * Aguarda o MySQL ficar disponível, tentando algumas vezes.
 * Útil porque o container do MySQL pode demorar alguns segundos
 * a mais que o backend Node para ficar pronto.
 */
async function aguardarBancoDeDados(tentativas = 15, intervaloMs = 3000) {
    for (let i = 1; i <= tentativas; i++) {
        try {
            const conexao = await pool.getConnection();
            conexao.release();
            console.log("[db] Conectado ao MySQL com sucesso.");
            return;
        } catch (erro) {
            console.log(`[db] Tentativa ${i}/${tentativas} - MySQL ainda não disponível (${erro.code || erro.message}).`);
            await new Promise((resolve) => setTimeout(resolve, intervaloMs));
        }
    }
    throw new Error("Não foi possível conectar ao MySQL após várias tentativas.");
}

module.exports = { pool, aguardarBancoDeDados };
