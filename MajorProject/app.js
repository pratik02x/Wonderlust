const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listings.js");
const Listing = require("./models/listings.js");
const ejs=require("ejs");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const{listingSchema,reviewsSchema}=require("./Schema.js");


const Review=require("./models/Reviews.js");
const listingRoute=require("./routes/listingRoutes.js");
const reviewRoute=require("./routes/reviewsRoutes.js");

const session=require("express-session");
const flash=require("connect-flash"); 


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));




app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public"))); 

app.use(session({
    secret: "MySecretCode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires:Date.now+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected successful to DB");
}).catch((err)=>{
    console.log(err);
})

//Routes
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);


app.get("/",(req,res)=>{
    res.send("hi i am root")
})




app.all("/{*splat}",(req,res,next)=>{
     next(new ExpressError(404,"page not found!"));
})


app.use((err,req,res,next)=>{
    
    // let{statusCode=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{err});
    
   
})



app.listen(8080,()=>{
    console.log("serever started on http://localhost:8080/listings");
})