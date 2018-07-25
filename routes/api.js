const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const router = express.Router();
const cheerio = require("cheerio");
const db = require("../models");
const request = require("request");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/ScrapeDB");


router.get("/scrape", (req, res) => {
    console.log("scrape worked")
    console.log(req);
    //scrape is not working  an error runs when I access this route.

    request("https://www.nytimes.com/", (err, res, body) => {
        console.log(res)
        if (!err) {
            const $ = cheerio.load(body);
            let count = 0;
            $('article').each(function (i, element) {
                let count = i;
                let result = {};
                result.title = $(element)
                    .children('story-heading')
                    .children('a')
                    .text().trim();
                result.link = $(element)
                    .children('.story-heading')
                    .children('a')
                    .attr("href");
                result.summary = $(element)
                    .children('.summary')
                    .text().trim()
                    || $(element)
                        .children('ul')
                        .text().trim();

                        //cherios scraping the page collecting heading, link &summary

                if (result.title && result.link && result.summary) {
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            count++;
                        })
                        .catch(function (err) {
                            return res.json(err);
                        });
                };

            });

            res.redirect("/");

        }
        else if (err){
            res.send("Cant locate new articles");
        }

    });
});


router.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);        
        })
        .catch(function (err) {
            res.json(err);
        });
});


router.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (dbArticle) {
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("saved", hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });;
});

router.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.get("/articles/:id", function (req, res) {
    db.Article.find({ _id: req.params.id })
    .populate({
        path: 'note',
        model: 'Note'
    })
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
});

module.exports = router;