import express from "express";
import cors from "cors";
import path from "path";
import __dirname from "./utils/utils.js";
import { config } from "../src/config/config.js";
import mongoose from "mongoose";

const PORT = config.PORT;
//servidor: consigue responder solitaciones. App es el servidor del express. El servidor estará escuchando en el puerto 3000, es decir, pueden hacer solicitaciones desde el puerto 3000. 3000 es un puerto que se usa para un servidor local.Todo servidor es una computadora. Este es local porque lo construimos en nuestra compu y utilizamos una de sus puertas para comunicación. Ahora necesitamos crear un camino para llegar a este servidor; y decir qué va a responder el servidor.
const app = express();
//transforma los datos en json para devolver los datos de esta manera
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, () => {
  console.log("Server listening...");
});

//ruta; requisición y respuesta
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).sendFile(path.join(__dirname, "../public/html/index.html"));
});

app.get("/recipes", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).sendFile(path.join(__dirname, "../public/html/recipes.html"));
});

app.get("/recipes/recipe", (req, res) => {
  const { id } = req.query; // Captura el ID desde los parámetros de ruta
  if (!id) {
    return res.status(400).send("Recipe ID is required.");
  }
  // Realiza acciones con el ID, como buscar datos en la base de datos.
  res.sendFile(path.join(__dirname, "../public/html/recipe.html"));
});

app.get("/contact", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).sendFile(path.join(__dirname, "../public/html/contact.html"));
});

const connDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, {
      dbName: config.DB_NAME,
    });
    console.log("DB online!");
  } catch (error) {
    console.log("Error connecting to DB.", error.message);
  }
};

connDB();
