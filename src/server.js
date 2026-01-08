import express from "express";
import cors from "cors";
import path from "path";
import __dirname from "./utils/utils.js";
import { config } from "../src/config/config.js";
import mongoose from "mongoose";
import { routerVistas } from "./routes/vistasRouter.js";
import { routerRecipes } from "./routes/recipesRouter.js";
import { routerPosts } from "./routes/postsRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger, middLogger } from "./utils/logger.js";

const PORT = config.PORT;
//servidor: consigue responder solitaciones. App es el servidor del express. El servidor estará escuchando en el puerto 3000, es decir, pueden hacer solicitaciones desde el puerto 3000. 3000 es un puerto que se usa para un servidor local.Todo servidor es una computadora. Este es local porque lo construimos en nuestra compu y utilizamos una de sus puertas para comunicación. Ahora necesitamos crear un camino para llegar a este servidor; y decir qué va a responder el servidor.
const app = express();
//transforma los datos en json para devolver los datos de esta manera
app.use(express.json());
app.use(middLogger);
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", routerVistas);
app.use("/api/recipes", routerRecipes);
app.use("/api/posts", routerPosts);

app.listen(PORT, () => {
  logger.info("Server listening...");
});

//primero instala con npm install mongodb y después configura; podría estar en config también
const connDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, {
      dbName: config.DB_NAME,
    });
    logger.info("DB online!");
  } catch (error) {
    logger.fatal(
      JSON.stringify(
        {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code,
        },
        null,
        5
      )
    );
  }
};

//ejecuta la función que conecta con la base de datos
connDB();
app.use(errorHandler);
