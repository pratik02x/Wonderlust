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
const{listingSchema}=require("./Schema.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));  

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected successful to DB");
}).catch((err)=>{
    console.log(err);
})

const validatelisting=(req,res,next)=>{
          let {error}=listingSchema.validate(req.body);
    
   if(error){
       let errMsg=error.details.map((el)=> el.message).join(",");
       throw(new ExpressError(400,errMsg));
   }
   else{
    next();
   }
}

app.get("/",(req,res)=>{
    res.send("hi i am root")
})

app.get("/listings",wrapAsync(async(req,res)=>{
   let listings= await listing.find({});
   res.render("listings/index.ejs",{listings});
}))

//show route --> a perticular list
app.get("/listings/:id",wrapAsync(async(req,res)=>{
      let{id}=req.params;
      let list=await listing.findById(id);
      res.render("listings/show.ejs",{list});
}))
// app.get("/testlisting",async (req,res)=>{
//     let list=new listing({
//         title:"natures love",
//         description:"water",
//         price:2000,
//         location:"ich",
//         country:"india"
//     })

//     await list.save();
//     res.send("saved");
// })

//new list

app.get("/listings/add/newlist",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));



app.post("/listings/add/newlist",validatelisting,wrapAsync(async (req,res,next)=>{
    

   
    
   let{title,description,img,price,location,country}=req.body;

    let list=new listing({
        title,
        description,
        img,
        price,
        location,
        country
    });
 
          await listing.insertOne(list);
   res.redirect("/listings");

  

}));

//edit
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    let list=await listing.findById(id);
    res.render("listings/edit.ejs",{list});
}))
//update
app.put("/listings/:id/edit",validatelisting,wrapAsync(async (req,res)=>{
    let{id}=req.params;
    let{title,description,img,price,location,country}=req.body;
    await listing.findByIdAndUpdate(id,{title,description,img,price,location,country});
    res.redirect(`/listings/${id}`);
}))

//delete

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

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