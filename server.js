const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json()); // Essencial para ler o JSON que vem do HTML

// 1. Conectar ao MongoDB Atlas (use sua string do Render/Atlas)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado ao MongoDB!"))
    .catch(err => console.error("Erro ao conectar:", err));

// 2. Definir o Esquema
const ProvaSchema = new mongoose.Schema({
    nomeProva: String,
    questoes: [{
        enunciado: String,
        alternativas: [String],
        correta: Number
    }]
});

const Prova = mongoose.model('Prova', ProvaSchema);

// 3. Rota para salvar
app.post('/salvar-prova', async (req, res) => {
    try {
        const novaProva = new Prova(req.body);
        await novaProva.save();
        res.status(201).send("Salvo com sucesso!");
    } catch (err) {
        res.status(500).send("Erro ao salvar");
    }
});

app.listen(3000, () => console.log("Servidor rodando!"));