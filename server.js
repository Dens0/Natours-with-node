const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({
  path: './config.env'
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

  }).then(() => console.log('DB connection success!'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour mus have a name'],
    unicue:true,
  },
  rating:{
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour mus have a name'],
  },

});

const Tour = mongoose.model('Tour',tourSchema)
const app = require('./app');
// console.log(process.env);

//START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});



