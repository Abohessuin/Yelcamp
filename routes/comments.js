
var express=require("express");
var router=express.Router();
var Comment    = require("../models/comment"),
    Campground = require("../models/campground");


router.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("./comments/new",{nc:campground});
        }
    })
})

router.post("/campgrounds/:id/comments",(req, res)=>{
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


function  isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports=router;