import express from 'express';
//import data from './data.js';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json()); //essas duas linhas converte o post request para um objeto json dentro do rec.body
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); //sb é sandbox
});

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

/*get tem dois parametros: a url e afunção que responde*/
/*app.get('/api/products', (req, res) => {
  res.send(data.products); /*send envia para o frontend
});*/

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend/build'))); //isso garante que tudo que for colocado nesse diretorio sera lido pelo server "localhost"

//o (*) indica que tudo que for posto no endereço após "http://localhost:${port}/` será servido pelo html indicado"
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message }); //trata possíveis erros no server
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
