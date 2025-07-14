const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// --- Funções Auxiliares do Banco de Dados ---
const readDB = () => {
    try {
        if (!fs.existsSync(dbPath)) {
            // Se o db.json não existe, cria um com estrutura padrão
            const defaultDB = {
                locais: [{ id: 'LOC001', polo: 'Polo Padrão', gestor: 'Admin' }],
                interacoes: [],
                users: [], // A autenticação ainda é front-end, mas a estrutura está aqui
                motivosMacro: [{ id: 'MM001', descricao: 'Dúvida Padrão' }],
                subMotivos: [{ id: 'SM001', motivoMacroId: 'MM001', descricao: 'Sub-motivo Padrão' }],
                motivosMicro: [{ id: 'MI001', subMotivoId: 'SM001', descricao: 'Micro-motivo Padrão' }]
            };
            writeDB(defaultDB);
            return defaultDB;
        }
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler ou criar o banco de dados:", error);
        throw error;
    }
};

const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// --- API Genérica para todos os recursos ---
const resources = ['locais', 'interacoes', 'users', 'motivosMacro', 'subMotivos', 'motivosMicro', 'configuracoes'];

resources.forEach(resource => {
    // GET all
    app.get(`/api/${resource}`, (req, res) => {
        const db = readDB();
        res.json(db[resource] || []);
    });

    // GET one by ID
    app.get(`/api/${resource}/:id`, (req, res) => {
        const db = readDB();
        const item = db[resource]?.find(i => i.id === req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item não encontrado' });
        }
    });

    // POST (create one)
    app.post(`/api/${resource}`, (req, res) => {
        const db = readDB();
        const newItem = req.body;
        
        if (resource === 'interacoes') {
             // Lógica específica para interações
            newItem.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
            newItem.dataHora = new Date().toISOString();
        } else if (!newItem.id) {
            newItem.id = Date.now().toString(36);
        }

        if (!db[resource]) db[resource] = [];
        db[resource].push(newItem);
        writeDB(db);
        console.log(`Novo item adicionado em '${resource}': ID ${newItem.id}`);
        res.status(201).json(newItem);
    });

    // PUT (update one)
     app.put(`/api/${resource}/:id`, (req, res) => {
        const db = readDB();
        const index = db[resource]?.findIndex(i => i.id === req.params.id);
        if (index > -1) {
            db[resource][index] = { ...db[resource][index], ...req.body };
            writeDB(db);
            console.log(`Item atualizado em '${resource}': ID ${req.params.id}`);
            res.json(db[resource][index]);
        } else {
            res.status(404).json({ message: 'Item não encontrado para atualizar' });
        }
    });

    // DELETE one
    app.delete(`/api/${resource}/:id`, (req, res) => {
        const db = readDB();
        const initialLength = db[resource]?.length || 0;
        db[resource] = db[resource]?.filter(i => i.id !== req.params.id) || [];
        if (db[resource].length < initialLength) {
            writeDB(db);
            console.log(`Item deletado de '${resource}': ID ${req.params.id}`);
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: 'Item não encontrado para deletar' });
        }
    });
});


// --- Iniciar o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando e pronto para receber dados em http://localhost:${PORT}`);
});