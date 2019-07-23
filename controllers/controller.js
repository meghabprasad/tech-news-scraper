const express = require('express');
const cheerio = require('cheerio');
const db = require('../models/');
var axios = require("axios");

// Initialize Express
var app = express();

