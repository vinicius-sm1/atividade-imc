"use strict";
const mysql = require("mysql");

// Configuração da conexão com MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "calculadora_imc",
});

// Conectar ao banco de dados
const connectToDatabase = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Erro ao conectar com o banco de dados:", err);
      return;
    }
    console.log("Conectado com sucesso");
  });
};

// Inicializar banco de dados
const initDatabase = () => {
  connectToDatabase();
};

// FUNÇÕES DE USUÁRIOS

// Buscar usuário por login
const findUserByLogin = (login) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM usuarios WHERE login = ?";
    connection.query(query, [login], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]); // Retorna o primeiro resultado ou undefined
      }
    });
  });
};

// Buscar usuário por ID
const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id, login, criado_em FROM usuarios WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Criar novo usuário
const createUser = (login, senhaHash) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO usuarios (login, senha) VALUES (?, ?)";
    connection.query(query, [login, senhaHash], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: results.insertId,
          login: login,
        });
      }
    });
  });
};

// FUNÇÕES DE HISTÓRICO DE IMC

// Salvar cálculo de IMC
const saveImcCalculation = (usuarioId, peso, altura, imc, categoria) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO historico_imc (usuario_id, peso, altura, imc, categoria) 
      VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(
      query,
      [usuarioId, peso, altura, imc, categoria],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: results.insertId,
            usuario_id: usuarioId,
            peso,
            altura,
            imc,
            categoria,
          });
        }
      }
    );
  });
};

// Buscar histórico de IMC do usuário
const getImcHistory = (usuarioId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, peso, altura, imc, categoria, criado_em 
      FROM historico_imc 
      WHERE usuario_id = ? 
      ORDER BY criado_em DESC
    `;
    connection.query(query, [usuarioId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Deletar registro de IMC
const deleteImcRecord = (id, usuarioId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM historico_imc WHERE id = ? AND usuario_id = ?";
    connection.query(query, [id, usuarioId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.affectedRows > 0);
      }
    });
  });
};

// Exportar funções
module.exports = {
  initDatabase,
  connection,
  findUserByLogin,
  findUserById,
  createUser,
  saveImcCalculation,
  getImcHistory,
  deleteImcRecord,
};
