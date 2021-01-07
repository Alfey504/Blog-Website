//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let homeStartingContent  = "hello";

// Mongo connection
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });
let posts = [];

const blogSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Blog = new mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){

  Blog.find(function(err, blogs){
    if(!err){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: blogs
      });
    }
    else{
      console.log(err);
    }
  })


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const blog = new Blog({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  blog.save();
  res.redirect("/");

});

app.get("/posts/:postid", function(req, res){

  const id = req.params.postid;
  Blog.findOne({_id: id}, function(err, blog){
    res.render("post", {
      title: blog.title,
      content: blog.body
    });
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
