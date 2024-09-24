import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './config/passport.config.mjs';
import dotenv from 'dotenv';

import handlebars from './config/handlebars.config.mjs';
import { config as serverSocketConfig } from './config/socket.config.mjs';
import connectDB from './config/mongoose.config.mjs';

import productsRouter from './routes/products.mjs';
import cartsRouter from './routes/carts.mjs';
import realtimeproductsRouter from './routes/realtimeproducts.mjs';
import sessionsRouter from './routes/sessions.mjs';

dotenv.config();

const app = express();
const port = 8080;

connectDB();

handlebars(app);

// Middleware para parsear cookies
app.use(cookieParser('MiSECRETO'));

// Middleware para manejar sesiones
app.use(session({
    secret: 'C0D3RH0US3',
    resave: true,
    saveUninitialized: false,
}));

app.use(express.json());
app.use(passport.initialize());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/realtimeproducts', realtimeproductsRouter);
app.use('/api/sessions', sessionsRouter);
app.use(express.static('public'));

app.get('/session', (req, res) => {
  if (!req.session.isFirst) {
      req.session.isFirst = true;
      res.send('Bienvenido esta es tu primera vez');
  } else {        
      res.send('Ya estuviste por aca...');
  }
});

app.get('/deleteSession', (req, res) => {
  req.session.destroy((error) => {
      if (error) res.send('No se pudo eliminar la session');
      else res.send('Session eliminada');
  });
});

const USERS = [{
  nombre: 'nacho',
  rol: 'admin',
}, {
  nombre: 'nico',
  rol: 'superadmin'
}];

app.post('/login', (req, res) => {
  const { usuario } = req.body;

  const userFinded = USERS.find(user => user.nombre === usuario);
  if (!userFinded) {
      req.session.username = usuario;
      req.session.rol = 'invitado';
      return res.send('Bienvenido invitado');
  }

  req.session.username = userFinded.nombre;
  req.session.rol = userFinded.rol;
  res.send('Bienvenido mi querido admin');
});

function isAdmin(req, res, next) {
  if (req.session.rol !== 'invitado') {
      return next();
  }

  return res.status(401).send('Flaco no tenes permisos');
}

app.get('/rutaAdmin', isAdmin, (req, res) => {
  res.send('si ves esto es porque sos un crack admin.');
});

const httpServer = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

serverSocketConfig(httpServer);