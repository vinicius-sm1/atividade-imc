const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
const PORT = 3001;
const JWT_SECRET = "67341e96b4b5b52d8bdf4f913979917f";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inicializar banco de dados
db.initDatabase();

// AUTENTICAÇÃO

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

// ROTAS DE AUTENTICAÇÃO

// Rota de cadastro
app.post("/api/register", async (req, res) => {
  try {
    const { login, senha } = req.body;

    // Validações
    if (!login || !senha) {
      return res.status(400).json({
        error: "Login e senha são obrigatórios",
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        error: "A senha deve ter no mínimo 6 caracteres",
      });
    }

    // Verifica se o usuário já existe
    const userExists = await db.findUserByLogin(login);
    if (userExists) {
      return res.status(400).json({
        error: "Este login já está em uso",
      });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o novo usuário
    const newUser = await db.createUser(login, hashedPassword);

    // Gera o token JWT
    const token = jwt.sign(
      { id: newUser.id, login: newUser.login },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      token,
      user: {
        id: newUser.id,
        login: newUser.login,
      },
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

// Rota de login
app.post("/api/login", async (req, res) => {
  try {
    const { login, senha } = req.body;

    // Validações
    if (!login || !senha) {
      return res.status(400).json({
        error: "Login e senha são obrigatórios",
      });
    }

    // Busca o usuário
    const user = await db.findUserByLogin(login);
    if (!user) {
      return res.status(401).json({
        error: "Login ou senha incorretos",
      });
    }

    // Verifica a senha
    const isValidPassword = await bcrypt.compare(senha, user.senha);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Login ou senha incorretos",
      });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        login: user.login,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Rota protegida - Perfil do usuário
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      id: user.id,
      login: user.login,
      criadoEm: user.criado_em,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

// Rota de verificação do token
app.get("/api/verify", authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      login: req.user.login,
    },
  });
});

// ROTAS DO IMC

// Salvar cálculo de IMC
app.post("/api/imc/save", authenticateToken, async (req, res) => {
  try {
    const { peso, altura, imc, categoria } = req.body;

    if (!peso || !altura || !imc || !categoria) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const newRecord = await db.saveImcCalculation(
      req.user.id,
      peso,
      altura,
      imc,
      categoria
    );

    res.status(201).json({
      message: "Cálculo salvo com sucesso",
      record: newRecord,
    });
  } catch (error) {
    console.error("Erro ao salvar IMC:", error);
    res.status(500).json({ error: "Erro ao salvar cálculo" });
  }
});

// Buscar histórico de IMC
app.get("/api/imc/history", authenticateToken, async (req, res) => {
  try {
    const history = await db.getImcHistory(req.user.id);

    res.json({
      history: history,
      total: history.length,
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

// Deletar registro de IMC
app.delete("/api/imc/history/:id", authenticateToken, async (req, res) => {
  try {
    const recordId = parseInt(req.params.id);
    const deleted = await db.deleteImcRecord(recordId, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    res.json({ message: "Registro deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar registro:", error);
    res.status(500).json({ error: "Erro ao deletar registro" });
  }
});

// ROTAS DE USUÁRIOS

// Listar todos os usuários
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const query =
      "SELECT id, login, senha, criado_em FROM usuarios ORDER BY criado_em DESC";

    db.connection.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar usuários:", err);
        return res.status(500).json({ error: "Erro ao buscar usuários" });
      }

      res.json({
        usuarios: results,
        total: results.length,
      });
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// ROTA RAIZ

app.get("/", (req, res) => {
  res.json({
    message: "API Calculadora IMC",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/register",
        login: "POST /api/login",
        profile: "GET /api/profile (protegida)",
        verify: "GET /api/verify (protegida)",
      },
      users: {
        list: "GET /api/users (protegida)",
      },
      imc: {
        save: "POST /api/imc/save (protegida)",
        history: "GET /api/imc/history (protegida)",
        delete: "DELETE /api/imc/history/:id (protegida)",
      },
    },
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\nServidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
