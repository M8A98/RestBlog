var express      = require("express");
var app          = express();
var bodyParser   = require("body-parser");
var mongoose     = require("mongoose");

mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
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

app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
       if(err){
           console.log("There´s an error - Line 30 " + err);
       }else{
           res.render("index",{blogs:blogs});
       }
   });
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("SERVER HAS STARTED") ;
});