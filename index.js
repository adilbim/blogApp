var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var blog = require('./modules/blog.js');
var comment = require('./modules/comment.js');

app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//connect mongoose
mongoose.connect('mongodb://localhost/blogApp', {useNewUrlParser: true});





app.get("/", function(req, res){
    res.redirect("/blogs");
});
//home page
app.get("/blogs", function(req, res){
    var blogs = blog.find().sort({date: -1}).exec({},function(err, back){
        if(err)
        {
            console.log("error!");
        }
        else
        {
            res.render("home.ejs", {blogs: back});
            //console.log(back);
        }
    });
    
});
//add new blog
app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});
//post
app.post("/blogs", function(req, res){
    blog.create(req.body.blog, function(err, newblog){
        if(err)
        {
            console.log("error in getting data!");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});
//show
app.get("/blogs/:id", function(req, res){
    blog.findById(req.params.id).populate("comments").exec(function(err, foundblog){
        if(err)
        {
            console.log("error from findById");
        }
        else{
            res.render("show.ejs", {blog: foundblog});
            //console.log("works fine");
        }
    });
});
//Edit
app.get("/blogs/:id/edit", function(req, res){
    
    blog.findById(req.params.id, function(err, foundblog){
           if(err)
           {
               console.log("error in the edit section");
           }
           else
           {
               res.render("edit.ejs", {blog: foundblog});
               //console.log(foundblog);
           }
    });
});
//Update
app.put("/blogs/:id", function(req, res){
   blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
       if(err)
       {
           console.log("error from the update section");
       }
       else
       {
            res.redirect("/blogs/" + req.params.id);
           //console.log(req.body.blog);
       }
   });
});
//delete
app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {
            console.log("error from the delete section!!");
        }
        else
        {
            res.redirect("/");
        }
    })
});

//===================================================
//The comment section
//===================================================

app.post('/blogs/:id',function(req, res){
    blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } 
        else 
        {
            comment.create(req.body.comment, function(err, comment){
                if(err)
                {
                    console.log(err);
                }
                else {
                    blog.comments.push(comment);
                    blog.save();
                    console.log("Created new comment");
                    res.redirect('/blogs/' + req.params.id);
                }
            });
        }
    });
})
;

app.listen(7000, function(){
    console.log("server is running successfully!");
})