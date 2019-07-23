const express = require('express');
var logger = require("morgan");
const mongoose = require('mongoose');
const axios = require("axios");
const cheerio = require("cheerio");

const db = require('./models');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));



//set up handlebars and set default view to main.handlebars
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//set up mongoDB
mongoose.connect("mongodb://localhost/techNews", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://news.ycombinator.com/").then(function (response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $(".title").each(function (i, element) {
          // Save the text and href of each link enclosed in the current element
          let result = {};
          result.title = $(element).children("a").text();
          result.link = $(element).children("a").attr("href");



          // If this found element had both a title and a link
          if (result.title && result.link) {
              // Insert the data in the scrapedData db
              db.Article
                  .create(result)
                  .then(function (dbArticle) {
                      res.send();
                      console.log(dbArticle);
                  })
                  .catch(function (err) {
                      res.json(err);
                      console.log(err);
                  });
          };
      });
  });
});

//retrieve data from our mongodb  (database: techNews, collection: Article) 
//gets all info about article including related saves and comments

app.get('/', (req, res) => {
  db.Article
      //find all the articles in the collection  
      .find({})
      //sort the articles by date scraped
      .sort({dateScraped: -1})
      //get another collection related to the articles
      .populate('note')
      //once you have all the info
      .then(dbArticle => {
          //send the info to index
          res.render('index', { data: dbArticle });
      })
      //if there is an error, send the error to the client
      .catch(err => res.json(err));
});

//save articles that you like 
app.post('/save/:id', function (req, res) {
  db.Article.update(
      { _id: req.params.id },
      { $set: { saved: true } },
      function (err, data) {
          if (err) {
              throw err;
          }
          res.send("Saved!")
      }
  );
});

//unsave articles 
app.post('/unsave/:id', function (req, res) {
  db.Article.update(
      { _id: req.params.id },
      { $set: { saved: false } },
      function (err, data) {
          if (err) {
              throw err;
          }
          res.send("Unsaved!")
      }
  );
});

//add a comment/note
app.post('/add/:id', function (req, res) {
  db.Note
      //create note with body of the comment or note
      .create(req.body)
      //once you have created that, 
      .then(dbNote => {
          //update the Article db with the note collection
          db.Article.update(
              { _id: req.params.id },
              { $set: { note: dbNote._id } },
              { multi: true },
              (err, num) => {
                  if (err) throw err;
                  res.send('Added');
              }
          )
      })
      .catch(err => res.json(err));
});

// Remove the note
app.post('/sub/:id1/:id2', function (req, res) {
  db.Note.remove(
      //remove the data for article note from the notes db
      { _id: req.params.id2 },
      (err, num) => {
          if (err) throw err;
      })
      .then(dbNote => {
          //make the noted in the db empty at that article id from the articles db
          db.Article.update(
              { _id: req.params.id1 },
              { $unset: { note: '' } },
              (err, num) => {
                  if (err) throw err;
                  res.send('Removed Note');
              }
          )
      })
      .catch(err => res.json(err));

//Edit the note content
app.post('/edit/:id', function (req, res) {
  db.Note.update(
      { _id: req.params.id },
      { $set: { text: req.body.text } },
      (err, data) => {
          if (err) throw err;
          res.send('Edited Note');
      }
  )
});
});

//start the server
app.listen(PORT, () => console.log(`App running on port ${PORT}!`) );
