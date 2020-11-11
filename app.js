//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const version = 2.5;
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_LOGIN, {
  useNewURLParser: true
});

//establish content schema
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//------------------------------------------------------------------



app.get("/", function(req, res) {

  Post.find({}, function(err, retrievedContent) {
    //console.log(retrievedContent);
    res.render("home", {
      content: retrievedContent
    });
  })


})

app.get("/contact", function(req, res) {
  res.render("contact");
})

app.get("/about", function(req, res) {
  res.render("about", {
    currentVersion: version
  });
})

app.get("/compose", function(req, res) {
  res.render("compose");
})

app.get("/post/:postID", function(req, res) {

  const requestedPostID = req.params.postID;
  Post.findOne({
    _id: requestedPostID
  }, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        currentPostID: requestedPostID,
        title: post.title,
        content: post.content
      });
    }

  });
})

app.post("/delete", function(req, res) {
  const currentPostID = req.body.deleteButton;
  Post.deleteOne({
    _id: currentPostID
  }, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  })
})

app.post("/edit", function(req, res) {
  const currentPostID = req.body.editButton;
  res.redirect("/edit/" + currentPostID);
})

app.get("/edit/:postID", function(req, res) {
  const requestedPostID = req.params.postID;
  Post.findOne({
    _id: requestedPostID
  }, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", {
        currentPostID: requestedPostID,
        title: post.title,
        content: post.content
      });
    }

  });
})

app.post("/update", function(req, res) {
  const requestedPostID = req.body.updateButton;
  revisedTitle = req.body.revisedTitle;
  revisedPost = req.body.revisedPost;
  var filter = {
    _id: requestedPostID
  };
  var update = {$set:{title:revisedTitle, content:revisedPost}};
  Post.updateOne(filter, update, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  })
})

app.post("/compose", function(req, res) {

  const composition = new Post({
    title: req.body.compositionTitle,
    content: req.body.compositionPost
  });

  composition.save(function(err) {
    if (!err) {
      console.log("database updated successfully");
      res.redirect("/");
    }
  });




})

app.post("/", function(req, res) {
  res.redirect("/compose");
})




//-------------------------------------------------------------------
const PORT = process.env.PORT || 3000;


app.listen(PORT, function() {
  console.log("Server started on port ${PORT}" );
});
