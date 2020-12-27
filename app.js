const bodyParser = require("body-parser");
var express=require("express");  
var app=express();
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));
var mongoose=require("mongoose");


mongoose.connect("mongodb://localhost/yel_campl");

var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
}) 

var Campground=mongoose.model("Campground",campgroundSchema);
/*
var campgrounds=[
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},

]*/



app.get("/",(req,res)=>{
    res.render("landingPage")
})


app.get("/campgrounds",(req,res)=>{
    Campground.find({},function(err,camp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds",{campgrounds:camp});
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
            res.redirect("/campgrounds");
        }
    })
  
})

app.get("/campgrounds/new",(req,res)=>{
     res.render("newCampground")
})

app.get("/campgrounds/:id",(req,res)=>{
    const id=req.params.id;
    Campground.findById(id,function(err,newCampground){
        if(err){
            console.log(err);
        }else{
            res.render("moreinfo",{NCG:newCampground});
        }
    })
})
app.listen(3000,()=>{
    console.log("server has started on port 3000")
})
