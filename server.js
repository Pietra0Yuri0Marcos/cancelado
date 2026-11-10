
// Importando as bibliotecas
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

// Criando a conexão com o banco:
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
const sapatos = client.db('loja').collection('sapatos');

// Criando os métodos HTTP:

app.post('/sapatos', async (req, res) => {
    const novoSapato = await sapatos.insertOne(req.body);
    res.status(201).json(novoSapato);
});

app.get('/sapatos', async (req, res) => {
    const listaSapatos = await sapatos.find().toArray();
    res.json(listaSapatos);
});

app.get('/sapatos/:id', async (req, res) => {
    const sapatoEspecifico = await sapatos.findOne({
        _id: new ObjectId(req.params.id)
    });
    res.json(sapatoEspecifico);
});

app.put('/sapatos/:id', async (req, res) => {
    const sapatoAtualizado = await sapatos.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
    );
    res.json(sapatoAtualizado);
});

app.delete('/sapatos/:id', async (req, res) => {
    const sapatoDeletado = await sapatos.deleteOne({
        _id: new ObjectId(req.params.id)
    });
    res.json(sapatoDeletado);
});

client.connect()
    .then(() => {
        console.log('CONECTADO AO MONGODB');
        app.listen(process.env.PORT || 3000, () =>
            console.log('API RODANDO NA PORTA 3000')
        );
    })
    .catch((erro) => console.log('ERRO AO CONECTAR', erro.message));