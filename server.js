// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport.config');
const app = express();
const port = 8080;

const handlebars = require("./config/handlebars.config.js");
const serverSocket = require("./config/socket.config.js");

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const realtimeproductsRouter = require('./routes/realtimeproducts');
const sessionsRouter = require('./routes/sessions');
const connectDB = require('./config/mongoose.config');
const dotenv = require('dotenv');

dotenv.config();

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

const httpServer = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

serverSocket.config(httpServer);