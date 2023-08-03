import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import path from 'path';

// import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import configg from './config';
import userRouter from './routers/userRouter';
import productRouter from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';
import cartRouter from './routers/cartRouter';
import stripe from "stripe";
import connectDB from './mongodb';
import orderRouter from './routers/orderRouter';
import data from './data';
dotenv.config();
const https = require('https');
const querystring = require('querystring');
// app.use(axios());

const app = express();
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());  
// app.set('view engine', 'ejs');
// app.use(bodyParser.json({ limit: "20mb" }));

app.get('/api/featuresprod', (req, res) => {
  res.send(data.featuresprod);
});


// app.use(bodyParser.json()); // it was used before the the version of express 4.1
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);


let stripGateway = stripe(process.env.STRIPE_SECRET);

//assessing frontend file from server and using it at dist server for production
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static('frontend/build'));
app.get('*', function (req, res) {
  res.sendFile('index.html', { root: 'frontend/build' });
});


app.use((err, req, res, next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});

app.listen(configg.PORT, () => {
  console.log(`serve at http://localhost:8000`);
});
