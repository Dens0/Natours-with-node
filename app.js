//TUTAJ TYLKO TO CO MA ZAWIERA EXPRESS
const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1). MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); //middleware between request and response
app.use(express.static(`${__dirname}/public`)); // daje dostęp do plików w folderze publicznym - działa przy plikach statycznych

app.use((req, res, next) => {
  // trzeba tutaj przywołąć next ponieważ bez tego  cykl req res się zablokuje i nie zwróci odpowiedzi nigdy
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//ROUTES
// Żeby połacczy router z aplikacją używamy  jako middleware
//PONIŻEJ MOUTING THE ROUTER

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
