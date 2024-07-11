require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./src/controllers/passportConfig')
const authRouter = require('./src/routes/auth')
const postRouter = require('./src/routes/post')

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

async function main() {
    await mongoose
      .connect(mongoDB)
      .catch((e) => {
        console.log(e);
        process.exit(0);
      })
  }
main();

const app = express();
app.use(cors());

app.use(express.json())
app.use(passport.initialize());
app.use('/user', authRouter);
app.use('/posts', postRouter);

app.listen(4000)