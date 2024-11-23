import express from "express";
import cors from "cors";
import path from "path";
import __dirname from "./utils/utils.js";
import { config } from "../src/config/config.js";
import mongoose from "mongoose";
import { routerVistas } from "./routes/vistasRouter.js";
import { routerRecipes } from "./routes/recipesRouter.js";

const PORT = config.PORT;
//servidor: consigue responder solitaciones. App es el servidor del express. El servidor estará escuchando en el puerto 3000, es decir, pueden hacer solicitaciones desde el puerto 3000. 3000 es un puerto que se usa para un servidor local.Todo servidor es una computadora. Este es local porque lo construimos en nuestra compu y utilizamos una de sus puertas para comunicación. Ahora necesitamos crear un camino para llegar a este servidor; y decir qué va a responder el servidor.
const app = express();
//transforma los datos en json para devolver los datos de esta manera
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

app.use("/", routerVistas);
app.use("/api/recipes", routerRecipes);

app.listen(PORT, () => {
  console.log("Server listening...");
});

//primero instala con npm install mongodb y después configura; podría estar en config también
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

//ejecuta la función que conecta con la base de datos
connDB();
