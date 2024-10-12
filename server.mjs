import express from 'express';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config as socketConfig } from './config/socket.config.mjs';
import initPassport from './config/passport.config.mjs';
import connectDB from './config/mongoose.config.mjs';
import productsRouter from './routes/products.mjs';
import cartsRouter from './routes/carts.mjs';
import realtimeproductsRouter from './routes/realtimeproducts.mjs';
import sessionsRouter from './routes/sessions.mjs';
import { isAdmin } from './middlewares/authmiddleware.mjs'; // Importa el middleware isAdmin

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a la base de datos
connectDB().then(() => {
  // Configuración de Handlebars
  app.engine('handlebars', handlebars.engine({
      defaultLayout: 'main',
      runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true
      }
  }));
  app.set('view engine', 'handlebars');

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
  app.use(passport.session()); // Asegúrate de inicializar las sesiones de Passport

  // Inicializa Passport
  initPassport();

  // Rutas
  app.use('/api/products', productsRouter);
  app.use('/api/carts', cartsRouter);
  app.use('/api/realtimeproducts', realtimeproductsRouter);
  app.use('/api/sessions', sessionsRouter);
  app.use(express.static('public'));

  // Ruta de ejemplo para sesiones
  app.get('/session', (req, res) => {
      if (!req.session.isFirst) {
          req.session.isFirst = true;
          res.send('Bienvenido esta es tu primera vez');
      } else {        
          res.send('Ya estuviste por aca...');
      }
  });

  // Ruta para eliminar la sesión
  app.get('/deleteSession', (req, res) => {
      req.session.destroy((error) => {
          if (error) res.send('No se pudo eliminar la session');
          else res.send('Session eliminada');
      });
  });

  // Ruta protegida para administradores
  app.get('/rutaAdmin', isAdmin, (req, res) => {
      res.send('si ves esto es porque sos un crack admin.');
  });

  // Inicia el servidor HTTP
  const serverHTTP = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });

  // Configuración de Socket.io
  socketConfig(serverHTTP);
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});