const express = require('express');
var logger = require("morgan");
const mongoose = require('mongoose');

const PORT = 3000;
const app = express();

//set up mongoDB
mongoose.connect("mongodb://localhost/techNews", { useNewUrlParser: true });

//set up handlebars and set default view to main.handlebars
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


require('./controllers/controller.js')(app); //controller has scraping code

//start the server
app.listen(PORT, () => console.log(`App running on port ${PORT}!`) );
