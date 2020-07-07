//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Gol D. Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the location of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece (which promises an unlimited amount of riches and fame), and quite possibly the most coveted of titles for the person who found it, the title of the Pirate King.";
const aboutContent = "This is a blog post website. You can create as much blogs and save it. We create an anime plot named (One Piece) on the home page. Your blogs are appeared after that post. The owner of this website is the CEO of @Levi_Corporation Mr.Aryan Chauhan.";
const contactContent = "Email - thakursaharsh8000@gmail.com";
const items = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res) {
  res.render("home",{start: homeStartingContent,items: items});
})

app.get("/about", function(req,res) {
  res.render("about",{start: aboutContent});
})

app.get("/contact", function(req,res) {
  res.render("contact",{start: contactContent});
})

app.get("/compose", function(req,res) {
  res.render("compose");
})

app.post("/compose", function(req,res) {
  const data = {
    title: req.body.blog,
    description: req.body.blogPost
  }
  items.push(data);
  res.redirect("/");
})

app.get("/posts/:postId", function(req,res) {
  const urlTitle = _.lowerCase(req.params.postId);
  let i=0;
  for( ;i < items.length;i++){
    const composeTitle = _.lowerCase(items[i].title);
    const urlData = items[i].description;
    if(composeTitle === urlTitle){
      res.render("post",{blogTitle: items[i].title,blogDes: urlData});
      break;
    }
  }
  if(i === items.length){
    console.log("Failure");
  }
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
