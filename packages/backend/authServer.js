require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const passport = require('./src/controllers/passportConfig')
const authRouter = require('./src/routes/auth')

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

const app = express();

async function main() {
    await mongoose
      .connect(mongoDB)
      .catch((e) => {
        console.log(e);
        process.exit(0);
      })
  }
main();

app.use(express.json())
app.use(passport.initialize());
app.use('/', authRouter);

app.listen(4000)