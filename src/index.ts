import express, { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { readdirSync } from 'fs';
import { sayHelloController } from './controllers';
import 'dotenv/config';
import session from 'express-session';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import https from 'https';
import cron from 'node-cron';
import { Server, createServer } from 'http';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares';
import { URL } from 'url';

const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;

//  Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

function keepAlive(url: string | https.RequestOptions | URL) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
}

// cron job to ping the server every minute and delete expired tokens every 5 minutes
cron.schedule('*/5 * * * *', () => {
  keepAlive('//');
  console.log('pinging the server every 5 minute');
});

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(morgan('tiny'));
app.use(cookieParser());

//serve all routes dynamically using readdirsync
readdirSync('./src/routes').map((path) => {
  //   app.use("/api/v1/", require(`./routes/${path}`));
  if (!path.includes('auth')) {
    //   app.use("/api/v1/", authenticateJWT, require(`./routes/${path}`));
    app.use('/api/v1/', require(`./routes/${path}`));
    console.log(path);
  } else {
    app.use('/api/v1/', require(`./routes/${path}`));
    console.log(path);
  }
});

app.get('/', sayHelloController);

// Error handler middleware
app.use(errorHandler);

// Handle all undefined routes
app.use('*', (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: 'Route not found', status: 404 });
});

const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: false,
};

app.use(cors(corsOptions));
// app.use(pgNotify(io));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
