require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require('path');
const mongoose = require("mongoose");
const memes = require('./model/meme');
const home = require('./routes/home');
mongoose.Promise = Promise;
const app = express();
const methodOverride = require('method-override');

app.use(express.static("public"));
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect('mongodb://localhost:27017/xmeme', { useNewUrlParser: true, useFindAndModify: false });
mongoose.set("useCreateIndex", true);

app.use('/', home);



let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})