
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const aboutContent = "This is a blog post website. You can create as much blogs and save it. We create an anime plot named (One Piece) on the home page. Your blogs are appeared after that post. The owner of this website is Mr.Aryan Chauhan.";
const contactContent = "Email - thakursaharsh8000@gmail.com";
mongoose.connect("mongodb+srv://atlas-levi25:test25012001@todo-list.vw2ki.mongodb.net/blogDB", {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});
// mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema = {
  title: {
    type: String,
    required: true
  },
  description: String
}
const Blog = mongoose.model("Blog", blogSchema);
const homeStartingContent1 = new Blog({
  title: "One Piece",
  description: "Gol D. Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the location of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece (which promises an unlimited amount of riches and fame), and quite possibly the most coveted of titles for the person who found it, the title of the Pirate King."
});
const homeStartingContent2 = new Blog({
  title: "Death Note",
  description: "Yagami Light is a 17-year-old genius from Japan who is tired of his life, school, and the state of the world as he knows it. One day, on the way home from class, Light stumbles upon a dark notebook with Death Note written on the front. Intrigued by its appearance, Light reads the first few sentences, only to find out that it states that anyone whose name is written inside will die. Discarding it as a joke, Light continues his daily activities. Soon after though, his human curiosity takes the better of him and prompts Light to try the notebook, discovering the truth behind first sentence. Now, with power in his hands, Yagami Light is on a quest to change the world and become God of the New World. His path to holy status won't be easy however, as another genius, known as L, is working against Light's beliefs and Light himself. Who will win this power of Gods between humans?"
});
const blogArray = [homeStartingContent1, homeStartingContent2];

app.get("/", function(req,res) {
  Blog.find({}, function(err, blogs){
    if(blogs.length !== 0){
      res.render("home", {blogs: blogs});
    } else{
      Blog.insertMany(blogArray, function(err) {
        if(err){
          console.log(err);
        } else{
          console.log("Successfully added items in collection.");
        }
      });
      res.redirect("/");
    }
  });
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
  const blog = new Blog({
    title: req.body.blog,
    description: req.body.blogPost
  });
  blog.save();
  res.redirect("/");
})

app.get("/blogs/:postId", function(req,res) {
  const urlTitle = _.lowerCase(req.params.postId);
  Blog.findOne({_id: req.params.postId}, function(err, foundData) {
    if(!err) {
      res.render("post",{blogTitle: foundData.title, blogDes: foundData.description});
    }
  });
})

app.post("/delete", function(req,res) {
  const deleteTitle = req.body.blogName;
  console.log(deleteTitle);
  if(deleteTitle === "One Piece" || deleteTitle === "Death Note") {
    res.render("failure");
  } else {
      Blog.findOne({title: deleteTitle}, function(err, foundBlog) {
      if(!err) {
        const deleteId = foundBlog._id;
        console.log(deleteId);
        Blog.findByIdAndRemove(deleteId, function(err, foundBlog) {
          if(!err) {
            console.log("Successfully deleted the blog from collection.");
          }
        });
        res.redirect("/");
      }
    });
  }
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
