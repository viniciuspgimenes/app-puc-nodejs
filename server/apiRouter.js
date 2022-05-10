const express = require('express')
const apiRouter = express.Router()
const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: 'postgres://whlhoxsuqrndse:d3d4e7139c0f9351b386b3ae2dd570d7752daeeb14419d9da02f319b0c56a69c@ec2-54-164-40-66.compute-1.amazonaws.com:5432/d35qdd5t3632uo',
        ssl: {rejectUnauthorized: false},
    }
});

apiRouter.use(express.json())

apiRouter.post('/produtos', (req, res) => {
    knex('produto')
        .insert({
            descricao: req.body.descricao,
            valor: req.body.valor,
            marca: req.body.marca
        })
        .returning('*')
        .then(produto => res.status(200).json(produto))
        .catch(err => res.status(500).json({message: 'Falha ao inserir produto - ' + err.message}));
})

apiRouter.get('/produtos', (req, res) => {
    knex.select('*').from('produto')
        .then(produtos => res.status(200).json(produtos))
        .catch(err => res.status(500).json({message: 'Erro ao recuperar produtos - ' + err.message}));
});

apiRouter.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    knex('produto').where({id}).from('produto')
        .then(produtos => res.status(200).json(produtos))
        .catch(err => res.status(500).json({message: 'Erro ao recuperar produto - ' + err.message}));
});

apiRouter.put('/produtos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const produtoEncontrado = await knex('produto').where({id}).from('produto');
    if (!produtoEncontrado) {
        res.status(404).send();
        return;
    }
    const produtoRequest = req.body;
    const produtoEditado = {
        id: produtoEncontrado.id,
        descricao: produtoRequest.descricao || produtoEncontrado.descricao,
        valor: produtoRequest.valor || produtoEncontrado.valor,
        marca: produtoRequest.marca || produtoEncontrado.marca,
    }
    knex("produto")
        .update(produtoEditado)
        .where({id})
        .then(() => res.status(200).json(produtoEditado))
        .catch(err => res.status(500).json({message: 'Erro ao editar produto - ' + err.message}));
});

apiRouter.delete('/produtos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await knex("produto")
            .del()
            .where({id});
        res.status(204).send('Produto deletado com sucesso');
    } catch (err) {
        res.status(500).json({message: "Falha ao excluir produto!"});
    }
});

module.exports = apiRouter