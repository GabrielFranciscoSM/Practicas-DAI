import 'dotenv/config'
import express   from "express"
import nunjucks  from "nunjucks"
import session   from "express-session"
      
import connectDB from "./model/db.js"
import TiendaRouter from "./routes/router_tienda.js"
const app = express()

const IN = process.env.IN || 'development'

await connectDB()


app.use(session({
	secret: 'my-secret',      // a secret string used to sign the session ID cookie
	resave: false,            // don't save session if unmodified
	saveUninitialized: false  // don't create session until something stored
}))

nunjucks.configure('views', {         // directorio 'views' para las plantillas html
	autoescape: true,
	noCache:    IN == 'development',   // true para desarrollo, sin cache
	watch:      IN == 'development',   // reinicio con Ctrl-S
	express: app
})
app.set('view engine', 'html')

app.use("/", TiendaRouter);

app.use('/static', express.static('public'))     // directorio public para archivos css, js, imágenes, etc.

// test para el servidor
app.get("/hola", (req, res) => {
  res.send('Hola desde el servidor');
});

// test para las plantillas
app.get("/test", (req, res) => {
  res.render('test.html');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en  http://localhost:${PORT}`);
})