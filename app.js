var bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express();

app.set("view engine", "ejs");
app.use(express.static("public"));//This is an express middleware to create a directory called public to load static file. 
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/restful_blog_app");
//restful_blog_app is the name of the app we are creating now. It can be named anything, doesnt exist yet

/*title
image
body
created*/

//MONGOOSE/MODEL CONFIG
// SHEMA SETUP
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now} //created shoud be a date. And its default value is Date.now
});

//compile the schema into a model
var Blog = mongoose.model("Blog", blogSchema); //"Blog" is a sigular name of the model  

Blog.create({
   title:"Test Blog",
   image:"https://pixabay.com/get/eb34b6072ffc1c22d2524518b7444795ea76e5d004b0144396f5c67aaee5b4_340.jpg",
   body:"HELLO THIS IS A BLOG POST"
});

//RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
   res.render("index"); 
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
});