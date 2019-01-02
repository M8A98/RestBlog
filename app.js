var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method")); //You are telling express to look for _method but it can be anything and you are also telling express to use PUT,DELETE or any other method.
//MONGOOSE /MODEL CONFIGURATION
var blogSchema = new mongoose.Schema({
   title:String,
   img:String,
   body:String,
   created:{type:Date,default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


//RESTFUL ROUTES

app.get("/",function(req, res) {
    res.redirect("/blogs");
});


//Index Route
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
       if(err){
           console.log("There´s an error - Line 30 " + err);
       }else{
           res.render("index",{blogs:blogs});
       }
   });
});

//NEW ROUTE
app.get("/blogs/new",function(req, res) {
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
   //Create blog
   Blog.create(req.body.blog,function(err,newBlog){//req.body.blog will get the title,img and body because of body[title] etc. from the inputs.
        if(err){
            res.render("new");
        }else{
            //then,redirect to the index.
            res.redirect("/blogs");
        }
   });
});

//SHOW

app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
       if (err){
           res.redirect("/blogs");
       } else{
           res.render("show",{blog : foundBlog});
       }
    });
})

//EDIT ROUTE

app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog : foundBlog});      
        }
    })
})

//UPDATE ROUTE

app.put("/blogs/:id",function(req,res){
   Blog.findByIdAndUpdate(req.body.id,req.body.blog,function(err,updatedBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
   res.send("You reached the destroy route"); 
});

app.get("*",function(req, res) {
    res.send("<h1>This site does not exist !</h1>")
})

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("SERVER HAS STARTED") ;
});