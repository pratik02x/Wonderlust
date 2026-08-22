const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listings.js");
const Listing = require("./models/listings.js");
const ejs=require("ejs");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


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

app.get("/",(req,res)=>{
    res.send("hi i am root")
})

app.get("/listings",async(req,res)=>{
   let listings= await listing.find({});
   res.render("listings/index.ejs",{listings});
})

//show route --> a perticular list
app.get("/listings/:id",async(req,res)=>{
      let{id}=req.params;
      let list=await listing.findById(id);
      res.render("listings/show.ejs",{list});
})
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

app.get("/listings/add/newlist",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings/add/newlist",async (req,res)=>{
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

});

//edit
app.get("/listings/:id/edit",async (req,res)=>{
    let{id}=req.params;
    let list=await listing.findById(id);
    res.render("listings/edit.ejs",{list});
})
//update
app.put("/listings/:id/edit",async (req,res)=>{
    let{id}=req.params;
    let{title,description,img,price,location,country}=req.body;
    await listing.findByIdAndUpdate(id,{title,description,img,price,location,country});
    res.redirect(`/listings/${id}`);
})

//delete

app.delete("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log("serever started on http://localhost:8080/listings");
})