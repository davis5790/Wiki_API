const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////// Requests Targeting All Articles /////////////////////////////////////////

app.route("/articles")
.get(function(req, res){

    Article.find({}, function(err, found){
        if (err){
            res.send(err);
        } else {
            res.send(found);
        };
    });

})
.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(err) {
            res.send(err);
        } else {
            res.send("Successfully added a new article.");
        };
    });

})
.delete(function(req,res){

    Article.deleteMany({}, function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("success")
        };
    });
});

//////////////////////////////////// Requests Targeting A Specific Article /////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res){

    Article.findOne({title: req.params.articleTitle }, function(err, found){
        if (err){
            res.send(err);
        } else {
            res.send(found);
        };
    });
})
.put(function(req, res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if (!err) {
                res.send("added article");
            };
        });
})
.patch(function(req, res){
        Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err) {
                res.send("updated article");
            };
        });
})
.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if (!err){
            res.send("article deleted");
        } else {
            res.send(err);
        };
    });
});




app.listen(3000, function(){
    console.log("Server started on port 3000");
});