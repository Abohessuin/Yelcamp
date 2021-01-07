
var express    = require("express"),
    bodyParser = require("body-parser"),
    app        = express(),
    mongoose   = require("mongoose"),
    passport = require("passport"),
    localStorage = require("passport-local"),
    User = require("./models/user")
    Comment    = require("./models/comment");
    Campground = require("./models/campground"),
    seedDB= require("./seed")



seedDB();
mongoose.connect("mongodb://localhost/yel_campl");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
///Auth config
app.use(require("express-session")({
    secret:"ALOOOOOOOOOOOO",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStorage(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.render("landingPage")
})


app.get("/campgrounds",(req,res)=>{
    Campground.find({},function(err,camp){
        if(err){
            console.log(err);
        }else{
            res.render("campground/campgrounds",{campgrounds:camp});
        }
    })
    
})


app.post("/campgrounds",(req,res)=>{
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCampgrounds={name:name,image:image,description:description};
    Campground.create(newCampgrounds,function(err,newCamp){
        if(err){
            console.log(err);
        }else{  
            res.redirect("campground/campgrounds");
        }
    })
  
})

app.get("/campgrounds/new",(req,res)=>{
     res.render("campground/newCampground")
})

app.get("/campgrounds/:id",(req,res)=>{
    const id=req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,newCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campground/moreinfo",{NCG:newCampground});
        }
    })
})


app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
       Campground.findById(req.params.id,(err,campground)=>{
           if(err){
               console.log(err);
           }else{
               res.render("./comments/new",{nc:campground});
           }
       })
})

app.post("/campgrounds/:id/comments",(req, res)=>{
        Campground.findById(req.params.id,(err, data)=>{
            if(err){
                console.log(err);
            }else{
                Comment.create(req.body.comment,(err,comment)=>{
                    if(err){
                        console.log(err);
                    }else{
                        data.comments.push(comment);
                        data.save();
                        res.redirect("/campgrounds/"+data._id);
                    }
                })
            }
        })
})



app.get("/register",(req,res)=>{
          res.render("register")
})

app.post("/register",(req,res)=>{
    var newUser =new User({username:req.body.username})
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/campgrounds");
        })
    })
})



app.get("/login",(req,res)=>{
    res.render("login")
})



app.post("/login",passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),(req,res)=>{
   
});


app.get("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/campgrounds");
})


function  isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}






app.listen(3000,()=>{
    console.log("server has started on port 3000")
})
