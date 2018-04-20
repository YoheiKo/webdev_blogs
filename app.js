var bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express();

app.set("view engine", "ejs");
app.use(express.static("public")); //This is an express middleware to create a directory called public to load static file. 
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
// Mount the middleware expressSanitizer below the bodyParser() instantiations and above mounting of your routes
app.use(methodOverride("_method"));
// Basically HtML form doesnt support anything other than GET or POST request
//"_method" could be anything. It looks for it in the url" 

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

/*Blog.create({
   title:"Test Blog",
   image:"https://pixabay.com/get/eb34b6072ffc1c22d2524518b7444795ea76e5d004b0144396f5c67aaee5b4_340.jpg",
   body:"HELLO THIS IS A BLOG POST"
});*/


// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){ //Retrieve all the data from the DB and name it "blogs"
      if(err){
          console.log("ERROR!");
      } else {
          res.render("index", {blogs: blogs}); //We want to render index with data
      }
  });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

// CREATE ROUTE (create new data and redirect)
app.post("/blogs", function(req, res){
   //sanitize body
   req.body.blog.body = req.sanitize(req.body.blog.body);
   //create blog
   Blog.create(req.body.blog, function(err, newBlog){
       //data from the post is inside the req.body
       if(err){
           res.render("new");
       } else {
           res.redirect("/blogs");
       }
   });
   //then redirect to the index
});

// SHOW ROUTE
app.get("/blogs/:id", function(req,res){
   Blog.findById(req.params.id, function(err, foundblog){
       if(err){
           res.redirect("/blogs");
       } else {
            res.render("show", {blog: foundblog});      
       }
       
   });
});


// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundblog){
       if(err){
          res.redirect("/blogs");     
       } else {
          res.render("edit", {blog: foundblog});   
       }
   });
   
});

// UPDATE ROUTE
// Method overide is listening for "?_method=PUT" and treat it as a PUT request
app.put("/blogs/:id", function(req, res){
    //sanitize body
   req.body.blog.body = req.sanitize(req.body.blog.body);        
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       //.findByIdAndUpdate is a very useful method. It find the model and update it
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/" + req.params.id);
           // redirect us to the show page
       }
   });
});


// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //DESTROY
    Blog.findByIdAndRemove(req.params.id, function(err){
    //REDIRECT TO SOMEWHERE
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
});