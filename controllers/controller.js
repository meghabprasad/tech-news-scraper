const express = require('express');
const cheerio = require('cheerio');
const db = require('../models/');
const axios = require("axios");

// Initialize Express
const app = express();


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

  
 