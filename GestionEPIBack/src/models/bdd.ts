//********** Imports **********/
import mariadb from "mariadb";

//********** Pool **********/
export const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "GestionEPI",
  connectionLimit: 5,
});