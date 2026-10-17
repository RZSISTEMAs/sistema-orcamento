const express = require('express');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(express.json());

// Rota para cadastrar a Empresa configurada na hora
app.post('/empresas', async (req, res) => {
    const { nome, cnpj, endereco, telefone } = req.body;
    try {
        const novo = await pool.query(
            'INSERT INTO empresas (nome, cnpj, endereco, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, cnpj, endereco, telefone]
        );
        res.status(201).json(novo.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Rota para criar um orçamento vinculado a uma empresa
app.post('/orcamentos', async (req, res) => {
    const { empresa_id, cliente_nome, descricao, valor_total } = req.body;
    try {
        const novo = await pool.query(
            'INSERT INTO orcamentos (empresa_id, cliente_nome, descricao, valor_total) VALUES ($1, $2, $3, $4) RETURNING *',
            [empresa_id, cliente_nome, descricao, valor_total]
        );
        res.status(201).json(novo.rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Rota para listar orçamentos com os dados da empresa configurada
app.get('/orcamentos', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT o.id, o.cliente_nome, o.descricao, o.valor_total, o.data_criacao,
                   e.nome AS empresa_nome, e.cnpj AS empresa_cnpj 
            FROM orcamentos o
            JOIN empresas e ON o.empresa_id = e.id
        `);
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de orçamentos rodando na porta ${PORT}`);
});