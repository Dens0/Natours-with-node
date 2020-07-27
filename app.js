const fs = require('fs');

const express = require('express');
const morgan = require('morgan');
const app = express();


//1). Middleweres
app.use(morgan('env'));
app.use(express.json()); //middleware between request and response
//taka jest konwencja
app.use((req, res, next) => {
  // trzeba tutaj przywołąć next ponieważ bez tego  cykl req res się zablokuje i nie zwróci odpowiedzi nigdy
  console.log('Hello from the middleware');
  next();

});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();

});


tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
//Routes handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours

    }
  });


};
const getTour = (req, res) => {

  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  // if (id>tours.length){

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID'
    });
  }


  res.status(200).json({
    status: 'success',
    data: {
      tour

    }
  });


};
const addTour = (req, res) => {
// console.log(req.body);


  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });

  });
};
const updateTour = (req, res) => {


  // if (id>tours.length){

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: null
  });
};
const deleteTour = (req, res) => {


  // if (id>tours.length){

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

const getAllUsers = (req, res) => {
res.status(500).json({
  status: 'error',
  message: 'This route is not yet defined'
})


};
const addUser = (req, res) => {


  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'})
};
const getUser = (req, res) => {


  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'})
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'})
};
const deleteUser = (req, res) => {

  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'})
};




// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


//ROUTES

app.route('/api/v1/tours')
  .get(getAllTours)
  .post(addTour);


app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(addUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);


//START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


// app.get('/',(req,res)=>{
//   res.status(200).json({ message:'Hello from the server side!',app:'Natours' })
//
// })
//
// app.post('/',(req,res)=>{
//   res.send('You can post to this endpoint')
// } )