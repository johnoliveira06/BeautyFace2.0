import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import MercadoPago from "mercadopago";
const salt = await bcrypt.genSalt(10);
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());

const client = new MercadoPago.MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const preference = new MercadoPago.Preference(client);

//MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beautyface",
});
console.log("Conectado ao BD!");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ Error: "Você não está logado" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(403).json({ Error: "Token errado" });
      } else {
        req.id = decoded.id;
        req.email = decoded.email;
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/products", async (req, res) => {
  try {
    db.query("SELECT * FROM products", (err, rows) => {
      if (err) throw err;
      res.status(200).json(rows);
    });
  } catch (error) {
    res.status(500).json({ Error: "Erro ao obter os registros" });
  }
});

app.post("/register", (req, res) => {
  const sql = "INSERT INTO users (`nome`, `email`, `senha`) VALUES (?)";
  bcrypt.hash(req.body.senha.toString(), salt, (err, hash) => {
    if (err) return res.status(400).json({ Error: "Senha não criptografada" });
    const values = [req.body.nome, req.body.email, hash];
    db.query(sql, [values], (err, result) => {
      if (err)
        return res.status(500).json({ Error: "Erro ao inserir os registros" });
      return res.status(201).json({ Status: "Sucesso" });
    });
    // console.log(values);
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.status(401).json({ Error: "Falha no login" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.senha.toString(),
        data[0].senha,
        (err, response) => {
          if (err) return res.status(500).json("Erro ao comparar senha");
          if (response) {
            const name = data[0].nome;
            const email = data[0].email;
            const id = data[0].id;
            const token = jwt.sign({ id, name, email }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.status(200).json({ Status: "Sucesso" });
          } else {
            return res.status(401).json({ Error: "Senha incorreta" });
          }
        }
      );
    } else {
      return res.status(404).json({ Error: "Email não cadastrado" });
    }
  });
});

app.get("/", verifyUser, (req, res) => {
  return res
    .status(200)
    .json({ Status: "Sucesso", id: req.id, name: req.name, email: req.email });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ Status: "Sucesso" });
});

app.post("/forgotPassword", (req, res, next) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.status(500).json({ Error: "Falha no envio do email" });
    if (data.length > 0) {
      const JWT_SECRET = "jwt-secret-key";
      const secret = JWT_SECRET + data[0].senha;
      const payload = {
        email: data[0].email,
        id: data[0].id,
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: "15m",
      });
      const link = `http://localhost:8000/resetPassword/${data[0].id}/${token}`;
      console.log(link);
      return res.status(200).json({ Status: "Sucesso" });
    } else {
      return res.status(404).json({ Error: "Email não cadastrado" });
    }
  });
});

app.get("/resetPassword/:id/:token", (req, res, next) => {
  const { id, token } = req.params;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ Error: "Falha na obtenção do id" });
    if (data.length > 0) {
      const JWT_SECRET = "jwt-secret-key";
      const secret = JWT_SECRET + data[0].senha;
      const payload = jwt.verify(token, secret);
      return res.redirect(
        `http://localhost:5173/reset?id=${data[0].id}&token=${token}`
      );
    } else {
      return res.status(404).json({ Error: "Id não encontrado" });
    }
  });
});

app.post("/resetPassword/:id/:token", (req, res, next) => {
  const { id, token } = req.params;

  if (req.body.senha !== req.body.novaSenha) {
    return res.status(400).json({ Error: "As senhas não coincidem!" });
  }

  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], async (err, data) => {
    if (err) return res.status(500).json({ Error: "Falha na obtenção do id" });
    if (data.length > 0) {
      const JWT_SECRET = "jwt-secret-key";
      const secret = JWT_SECRET + data[0].senha;

      try {
        const payload = jwt.verify(token, secret);
        bcrypt.hash(req.body.senha.toString(), salt, async (err, hash) => {
          if (err) {
            return res
              .status(500)
              .json({ Error: "Erro ao criar o hash da senha." });
          }
          const updateSql = "UPDATE users SET senha = ? WHERE id = ?";
          db.query(updateSql, [hash, id], (updateErr) => {
            if (updateErr) {
              return res.status(500).json({
                Error: "Erro ao atualizar a senha",
              });
            }
            return res.status(200).json({ Status: "Sucesso" });
          });
        });
      } catch (error) {
        return res.status(401).json({ Error: "Token expirado" });
      }
    } else {
      return res.status(404).json({ Error: "Id não encontrado" });
    }
  });
});

app.post("/insertProduct", (req, res) => {
  const { userId, produtoId, quantidade } = req.body;

  console.log(produtoId);
  console.log(userId);

  const checkProductQuery = "SELECT * FROM products WHERE id = ?";
  db.query(checkProductQuery, [produtoId], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ Error: "Erro ao verificar produto na tabela produtos." });
    }

    if (results.length === 0) {
      return res.status(404).json({ Error: "Produto não encontrado." });
    }

    const insertProductQuery =
      "INSERT INTO cart (`userId`, `produtoId`, `quantidade`, `nome`, `preco`, `imagem`) VALUES (?, ?, ?, ?, ?, ?)";
    const { nome, preco, imagem } = results[0];

    db.query(
      insertProductQuery,
      [userId, produtoId, quantidade, nome, preco, imagem],
      (error, results) => {
        if (error) {
          return res
            .status(500)
            .json({ Error: "Erro ao inserir produto no carrinho." });
        }

        return res
          .status(200)
          .json({ Success: "Produto inserido no carrinho com sucesso." });
      }
    );
  });
});

app.get("/cartProducts/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    db.query("SELECT * FROM cart WHERE userId = ?", [userId], (err, rows) => {
      if (err) {
        console.error("Erro ao obter os registros:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
        return;
      }

      res.json(rows);
    });
  } catch (error) {
    console.error("Erro ao obter os registros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.delete("/removeProduct/:produtoId", (req, res) => {
  try {
    const produtoId = parseInt(req.params.produtoId);

    const query = `DELETE FROM cart WHERE id = ?`;

    db.query(query, [produtoId], (error, results) => {
      if (error) {
        console.error("Erro ao remover produto do banco de dados:", error);
        res.status(500).send("Erro interno no servidor.");
      } else if (results.affectedRows === 1) {
        res.status(200).send("Produto removido com sucesso.");
      } else {
        res.status(404).send("Produto não encontrado no carrinho.");
      }
    });
  } catch (error) {
    console.error("Erro interno:", error);
    res.status(500).send("Erro interno no servidor.");
  }
});

app.post("/checkout", verifyUser, (req, res) => {
  const userId = req.id;
  console.log("ID do usuário logado:", userId);

  db.query(
    "SELECT * FROM cart WHERE userId = ?",
    [userId],
    (err, cartProducts) => {
      if (err) {
        console.error("Erro ao selecionar carrinho:", err);
        return res.status(500).json({ error: "Erro no servidor interno" });
      }

      if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
        return res.status(400).json({ error: "Carrinho vazio" });
      }

      const totalPedido = cartProducts.reduce(
        (total, product) => total + product.quantidade * product.preco,
        0
      );

      db.query(
        "INSERT INTO orders (userId, total, data) VALUES (?, ?, NOW())",
        [userId, totalPedido],
        (err, pedidoResult) => {
          if (err) {
            console.error("Erro ao inserir pedido:", err);
            return res.status(500).json({ error: "Erro no servidor interno" });
          }

          const pedidoId = pedidoResult.insertId;

          const insertDetailsQueries = cartProducts.map((product) =>
            db.query(
              "INSERT INTO order_details (pedidoId, produtoId, quantidade, valorUnitario) VALUES (?, ?, ?, ?)",
              [pedidoId, product.produtoId, product.quantidade, product.preco]
            )
          );

          Promise.all(insertDetailsQueries)
            .then(() => {
              db.query("DELETE FROM cart WHERE userId = ?", [userId], (err) => {
                if (err) {
                  console.error("Erro ao deletar produtos:", err);
                  return res
                    .status(500)
                    .json({ error: "Erro no servidor interno" });
                }

                const userEmail = req.email;
                console.log("Email do usuário logado:", userEmail);

                const items = cartProducts.map((produto) => ({
                  title: produto.nome,
                  quantity: produto.quantidade || 1,
                  currency_id: "BRL",
                  unit_price: parseFloat(produto.preco),
                }));

                let body = {
                  items: items,
                  payer: {
                    email: userEmail,
                  },
                  payment_methods: {
                    installments: 3,
                  },
                  back_urls: {
                    success: "http://localhost:5173/orders",
                    failure: "http://localhost:5173/cart",
                  },
                  auto_return: "approved",
                };
                console.log("Payment Body:", body);
                preference
                  .create({ body })
                  .then(function (data) {
                    res.send(JSON.stringify(data.init_point));
                    console.log(data);
                  })
                  .catch(function (error) {
                    console.error(error);
                    res.status(500).send("Erro ao realizar pagamento");
                  });
              });
            })
            .catch((error) => {
              console.error("Erro inserindo detalhes do produto:", error);
              res.status(500).json({ error: "Erro no servidor" });
            });
        }
      );
    }
  );
});

// app.get("/orders", verifyUser, (req, res) => {
//   const userId = req.id;
//   console.log(userId);

//   const sql = "SELECT * FROM orders WHERE userId = ?";

//   db.query(sql, [userId], (err, results) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ error: "Erro ao obter os pedidos do banco de dados." });
//     }
//     res.json(results);
//   });
// });

app.get("/orders", verifyUser, (req, res) => {
  const userId = req.id;

  const sql =
    "SELECT o.id as orderId, o.data, od.produtoId, od.quantidade, o.total, od.valorUnitario, p.nome as nomeProduto " +
    "FROM orders o " +
    "JOIN order_details od ON o.id = od.pedidoId " +
    "JOIN products p ON od.produtoId = p.id " +
    "WHERE o.userId = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao executar a consulta SQL:", err);
      return res.status(500).json({
        error:
          "Erro interno do servidor ao obter os pedidos do banco de dados.",
      });
    }
    res.json(results);
  });
});

app.listen(8000, () => {
  console.log("Conectado!");
});
