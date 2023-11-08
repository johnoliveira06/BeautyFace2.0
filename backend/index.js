import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt"

const salt = 10;

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
  bcrypt.hash(req.body.senha.toString(), salt, (err, hash) => {
    if(err) return res.json({Error: "Senha não criptografada"});
    const values = [req.body.nome, req.body.email, hash];
    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Erro ao inserir os registros" });
      return res.json({ Status: "Sucesso" });
    });
    console.log(values);
  })
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({Error: "Falha no login"});
    if (data.length > 0) {
      bcrypt.compare(req.body.senha.toString(), data[0].senha, (err, response)=>{
            if (err) return res.json("Erro ao comparar senha");
            if(response){
              return res.json({ Status: "Sucesso" });
            } else {
              return res.json({ Error: "Senha incorreta" });
            }
        
      })
    } else {
      return res.json({Error: "Email não cadastrado"});
    }
  })
});

app.listen(8000, () => {
  console.log("Conectado!");
});
