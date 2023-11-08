import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beautyface",
});
console.log("Conectado ao BD!");

app.get("/products", async (req, res) => {
  try {
    db.query("SELECT * FROM products", (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  } catch (error) {
    console.error("Erro ao obter os registros:", error);
  }
});

app.post("/register", (req, res) => {
  const sql = "INSERT INTO users (`nome`, `email`, `senha`) VALUES (?)";
  const values = [req.body.nome, req.body.email, req.body.senha];
  console.log(values);
  db.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Erro ao inserir os registros" });
    return res.json({ Status: "Sucesso" });
  });
});

app.post("/login", async (req, res) => {
  const sql = "SELECT * FROM user WHERE email = ? AND senha =?";
  db.query(sql, [req.body.email, req.body.senha], (err, data) => {
    if (err) return res.json("Falha no login");
    if (data.length > 0) {
      return res.json("Sucesso");
    } else {
      return res.json("Sem registros");
    }
  });
});

app.listen(8000, () => {
  console.log("Conectado!");
});
