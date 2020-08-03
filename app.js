//TUTAJ TYLKO TO CO MA ZAWIERA EXPRESS
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();



//1). MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); //middleware between request and response
app.use(express.static(`${__dirname}/public`)); // daje dostęp do plików w folderze publicznym - działa przy plikach statycznych

// console.log(process.env.NODE_ENV);


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
