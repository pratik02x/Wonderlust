const express=require("express");
const router=express.Router();

const User=require("../models/User.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",async (req,res)=>{

    try{
               let{username,email,password}=req.body;
    
        const newuser= new User({
            username,
            email,
            password
        });

            let user=await User.register(newuser,password);
            req.flash("success","user registered successfully!");
            console.log(User)
            res.redirect("/listings");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
    
   

})

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
    passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),
    (req,res)=>{
      req.flash("success","Welcome to the Wonderlust!")
      res.redirect("/listings")
      
})
module.exports=router;