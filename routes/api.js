const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const path = require("path");
const db = require("../models");

router.get("/scrape", (req, res) => {
    console.log("scrape worked")
    console.log(req);

    request("https://www.nytimes.com/", (err, res, body) => {
        if (!err) {
            const $ = cheerio.load(body);
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

            res.redirect('/')

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


module.exports = router;