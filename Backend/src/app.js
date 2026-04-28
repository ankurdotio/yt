import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import router from './routes/index.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', router);

export default app;