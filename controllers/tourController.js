const fs = require('fs');

tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, value) => {
  console.log(`Param ID is ${value}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  console.log(req.body.name);
  console.log(req.body.price);

  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  next();
};

//Routes handlers
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id>tours.length){

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.addTour = (req, res) => {
  // console.log(req.body);

  const newID = tours[tours.length - 1].id + 1;
  const newTour = { id: newID, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.updateTour = (req, res) => {
  // if (id>tours.length){

  res.status(200).json({
    status: 'success',
    data: null,
  });
};
exports.deleteTour = (req, res) => {
  // if (id>tours.length){

  res.status(204).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};
