const Tour = require('./../model/tourModel');


//Routes handlers
exports.getAllTours = async (req, res) => {
  try {
    //nie można z const queryObj = req.query ponieważ  queryObj ma referencję do req.query i jesli coś w nim zmienimy zmienimy również w drugim dlatego konieczne jest zrobienie hard copy
    //trick   uzywamy destukturyzacji  tworząc wierną kopię
    //BUDOWA ZAPYTANIA


    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // Filtrowanie zaawansowane
    // | => or, \b => dokładnie taki wyraz  g=>zamiania więcej niż jeden wyraz a nie tylko pierwszy

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);//match oznacz kolejne zmienne które będą podstawiane.

    // FILTROWANIE ZA POMOCĄ OBIEKTU
    let query = Tour.find(JSON.parse(queryStr));
    //SORTOWANIE
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('createdAt');
    }


    //Limitowanie pól
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); //minus oznacza że to pole jest wykluczane
    }

    //PAGINACJA
    //Przykładowe zapytanie skip => ilość wyników   które chcielibysmy pominąc zanim zaczniemy odpytywać dane czyli to jest jak placeholdr
    //limit=>to to samo co zadeklarowaliśmy w  w querystring ilość rezulatatów które chcemy w zapytaniu
    //page=?&limit=10, 1-10,page 1, 11-20,page 2, 21-30, page 3
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numberTours = await Tour.countDocuments();
      if (skip >= numberTours) throw new Error('This page does not exist ');
    }
    //WYKONANIA ZAPYTANIA
    const tours = await query;
    //LUB
    // const query = Tour.find()
    //   .find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    // console.log(req.query);

//SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      createdAt: tours.createdAt,
      data: {
        tours//: tours.createdAt
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }

};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); //to jest skrócona wersja poniższego
    // Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'succes',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body).then();


    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {

    res.status(400).json({
      status: 'fail',
      message: 'err'
    });


  }
};
exports.updateTour = async (req, res) => {

  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });


    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {

    res.status(404).json({
      status: 'fail',
      message: err
    });


  }
};
exports.deleteTour = async (req, res) => {

  try {

    await Tour.findByIdAndDelete(req.params.id, {
      new: true,
      runValidators: true
    });


    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {

    res.status(404).json({
      status: 'fail',
      message: err
    });


  }
};


// if (id>tours.length){
// const tour = tours.find((el) => el.id === id);
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour
//   }
// });
// const fs = require('fs');

// tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, value) => {
//   console.log(`Param ID is ${value}`);
//
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'INVALID ID'
//     });
//   }
//   next();
// };

//
// exports.checkBody = (req, res, next) => {
//   console.log(req.body.name);
//   console.log(req.body.price);
//
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//
//   next();
// };
