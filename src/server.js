import express from "express";

//servidor: consigue responder solitaciones. App es el servidor del express. El servidor estará escuchando en el puerto 3000, es decir, pueden hacer solicitaciones desde el puerto 3000. 3000 es un puerto que se usa para un servidor local.Todo servidor es una computadora. Este es local porque lo construimos en nuestra compu y utilizamos una de sus puertas para comunicación. Ahora necesitamos crear un camino para llegar a este servidor; y decir qué va a responder el servidor.

const app = express();
app.listen(3000, () => {
  console.log("Server listening...");
});

//ruta; requisición y respuesta
app.get("/api", (req, res) => {
  res.status(200).send("Hola");
});
