const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const path = require("path");
const db = require("../models");

router.get("/scrape", (req, res)=>{
    console.log("scrape worked")
    console.log(req);

    request("https://www.nytimes.com/", (err, res, body)=>{
        if(!err){
            const $ = cheerio.load(body);

        }

    })
})

module.exports = router;