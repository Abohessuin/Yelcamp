const bodyParser = require("body-parser");
var express=require("express");  
var app=express();
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));



var campgrounds=[
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},

]



app.get("/",(req,res)=>{
    res.render("landingPage")
})


app.get("/campgrounds",(req,res)=>{
    
    res.render("campgrounds",{campgrounds:campgrounds});
})


app.post("/campgrounds",(req,res)=>{
    var name=req.body.name;
    var image=req.body.image;
    var newCampgrounds={name:name,image:image};
    campgrounds.push(newCampgrounds);
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new",(req,res)=>{
     res.render("newCampground")
})
app.listen(3000,()=>{
    console.log("server has started on port 3000")
})
