import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beautyface",
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "barbeasy_two",
});
console.log("conectado");
