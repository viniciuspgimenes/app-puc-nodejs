const express = require('express')
const apiRouter = express.Router()

apiRouter.use(express.json())

const lista_produtos = {
    produtos: [
        {id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João"},
        {id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans"},
        {id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé"},
        {id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps"},
        {id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé"},
    ]
};

apiRouter.post('/produtos', (req, res) => {
    try {
        const maxId = Math.max.apply(Math, lista_produtos.produtos.map(it => it.id));
        const novoProdutoId = maxId + 1;
        const novoProduto = {
            id: novoProdutoId,
            descricao: req.body.descricao,
            valor: req.body.valor,
            marca: req.body.marca
        };
        lista_produtos.produtos.push(novoProduto);
        res.status(201).json(novoProduto);
    } catch (err) {
        res.status(500).json({message: "Falha ao inserir novo produto!"});
    }
})

apiRouter.get('/produtos', (req, res) => {
    try {
        res.status(200).json(lista_produtos)
    } catch (err) {
        res.status(500).json({message: "Falha ao buscar produtos!"});
    }
});

apiRouter.get('/produtos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const produtoEncontrado = lista_produtos.produtos.find(it => it.id === id);
        if (!produtoEncontrado) {
            res.status(404).send();
            return;
        }
        res.status(200).json(produtoEncontrado);
    } catch (err) {
        res.status(500).json({message: "Falha ao buscar produto!"});
    }
});

apiRouter.put('/produtos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const produtoEncontrado = lista_produtos.produtos.find(it => it.id === id);
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
        };
        const indiceCorrespondente = lista_produtos.produtos.indexOf(produtoEncontrado);
        lista_produtos.produtos[indiceCorrespondente] = produtoEditado;
        res.status(200).send(produtoEditado);
    } catch (err) {
        res.status(500).json({message: "Falha ao alterar produto!"});
    }
});

apiRouter.delete('/produtos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const indiceProduto = lista_produtos.produtos.findIndex(it => it.id === id);
        if (indiceProduto < 0) {
            res.status(404).send();
            return;
        }
        lista_produtos.produtos.splice(indiceProduto, 1);
        res.status(204).send('Produto deletado com sucesso');
    } catch (err) {
        res.status(500).json({message: "Falha ao excluir produto!"});
    }
});

module.exports = apiRouter