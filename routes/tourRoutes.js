const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router(); //Tworzymy nowy Router
router.param('id', tourController.checkID);
// router.param('id', tourController.checkBody);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

