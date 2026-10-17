const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const criarTabelas = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS empresas (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            cnpj VARCHAR(20),
            endereco TEXT,
            telefone VARCHAR(50)
        );

        CREATE TABLE IF NOT EXISTS orcamentos (
            id SERIAL PRIMARY KEY,
            empresa_id INT REFERENCES empresas(id),
            cliente_nome VARCHAR(255) NOT NULL,
            descricao TEXT,
            valor_total NUMERIC(10, 2) NOT NULL,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log('Tabelas "empresas" e "orcamentos" verificadas/criadas com sucesso!');
    } catch (err) {
        console.error('Erro ao criar tabelas:', err);
    }
};

criarTabelas();

module.exports = pool;