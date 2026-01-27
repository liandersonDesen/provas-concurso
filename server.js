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

const verificarSenha = (req, res, next) => {
    const senhaRecebida = req.headers['x-admin-password'];
    
    if (senhaRecebida === process.env.ADMIN_PASSWORD) {
        next(); // Senha correta, pode continuar para a rota
    } else {
        res.status(401).send("Acesso negado: Senha incorreta");
    }
};
// 3. Rota para salvar
app.post('/salvar-prova', verificarSenha, async (req, res) => {
    try {
        const novaProva = new Prova(req.body);
        await novaProva.save();
        res.status(201).send("Salvo com sucesso!");
    } catch (err) {
        res.status(500).send("Erro ao salvar");
    }
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Servidor de provas de concurso rodando!",
    timestamp: new Date().toISOString()
  });
});

app.get('/listar-provas', async (req, res) => {
    try {
        // Buscamos todas, mas pedimos apenas o campo 'nomeProva'
        const lista = await Prova.find({}, 'nomeProva'); 
        res.json(lista);
    } catch (err) {
        res.status(500).json({ erro: "Não foi possível listar as provas" });
    }
});

app.get('/prova/:id', async (req, res) => {
    try {
        const prova = await Prova.findById(req.params.id);
        res.json(prova);
    } catch (err) {
        res.status(404).json({ erro: "Prova não encontrada" });
    }
});

app.listen(3000, () => console.log("Servidor rodando!"));
