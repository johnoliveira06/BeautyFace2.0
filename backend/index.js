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

app.listen(8000, () => {
  console.log("Conectado!");
});
