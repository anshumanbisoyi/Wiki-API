const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public")); //to add static files to the app.js

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
}); //connecting to be local database

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
/////////////////////////Requests Targetting all articles/////////////////////
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) { //to fetch all articles
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });
  })
  .post(function(req, res) {
    const newArticle = new Article({ //posts a new json
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) { //saves it in the database
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) { //deletes all jsons
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  }); //end of the route(/articles)

//////////////////////Requests targeting a specific article//////////////////////
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle //to fetch one json
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })

  .put(function(req, res) {
    Article.updateOne(
      {title: req.params.articleTitle}, //to select the one to update
      {
        title: req.body.title,
        content: req.body.content
      }, //to update the properties
      //{overwrite:true},
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.updateOne(
      {title: req.params.articleTitle}, //to be patched
       {$set: req.body}, //property to be patched
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      });
  })
.delete(function(req, res) {
  Article.deleteOne(
    {title:req.params.articleTitle}, //to be deleted
     function(err){
    if (!err) {
      console.log("Successfully deleted an article");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
