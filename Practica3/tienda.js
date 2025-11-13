import 'dotenv/config'
import express   from "express"
import nunjucks  from "nunjucks"
import session   from "express-session"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
      
import connectDB from "./model/db.js"
import TiendaRouter from "./routes/router_tienda.js"
import UserRouter from "./routes/user_router.js"
import Producto from './model/Producto.js'
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies so we can read JWT sent as cookie
app.use(cookieParser());

// middleware global para calcular cantidad de productos y precio total del carrito
app.use(async (req, res, next) => {
	try {
		const cart = (req.session && Array.isArray(req.session.cart)) ? req.session.cart : [];

		// cantidad de productos
		const cantidad = cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);

		// precio total — si no hay items no hacemos consulta
		let total = 0;
		if (cart.length) {
			const ids = cart.map(item => item.id);
			const productos = ids.length ? await Producto.find({ _id: { $in: ids } }).lean() : [];
			for (const item of cart) {
				const prod = productos.find(p => String(p._id) === String(item.id));
				if (!prod) continue;
				const precioUnit = Number(prod.precio_euros) || 0;
				const descuento = Number(prod.descuento) || 0;
				const qty = Number(item.qty) || 1;
				total += precioUnit * (1 - descuento) * qty;
			}
		}

		// hacer disponibles en las plantillas
		res.locals.cantidadProductos = cantidad;
		res.locals.precioTotal = Number(total || 0).toFixed(2);
	} catch (err) {
		console.error('Error calculando carrito global:', err.message || err);
		res.locals.cantidadProductos = 0;
		res.locals.precioTotal = (0).toFixed(2);
	}
	next();
});

// middleware de autenticación: verifica el JWT y deja `app.locals.usuario` disponible en las plantillas
const autentificacion = (req, res, next) => {
	const token = req.cookies && req.cookies.access_token;
	if (token) {
		try {
			const data = jwt.verify(token, process.env.SECRET_KEY);
			req.username = data.usuario;
			app.locals.usuario = data.usuario;
			req.admin = data.admin;
			app.locals.admin = data.admin;
			console.log('User admin status:', data.admin);

		} catch (err) {
			console.error('JWT verify failed:', err.message);
			res.clearCookie('access_token');
			app.locals.usuario = undefined;
			app.locals.admin = undefined;
		}
	} else {
		app.locals.usuario = undefined;
		app.locals.admin = undefined;
	}
	next();
}
app.use(autentificacion);



app.use("/", TiendaRouter);
app.use("/usuario", UserRouter);

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