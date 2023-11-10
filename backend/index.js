import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const salt = await bcrypt.genSalt(10);

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(cookieParser());

//MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beautyface",
});
console.log("Conectado ao BD!");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token
  if(!token){
    return res.json({Error: "Você não está logado"})
  }
  else{
    jwt.verify(token, "jwt-secret-key", (err, decoded) =>{
      if(err){
        return res.json({Error: "Token errado"})
      }
      else{
        req.name = decoded.name;
        next();
      }
    })
  }
}

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
    // console.log(values);
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
              const name = data[0].nome
              const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: '1d'})
              res.cookie('token', token);
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

app.get('/', verifyUser, (req, res) => {
  return res.json({Status: "Sucesso", name: req.name});
})

app.get('/logout', (req, res)=>{
  res.clearCookie('token');
  return res.json({Status: "Sucesso"})
})

app.listen(8000, () => {
  console.log("Conectado!");
});
