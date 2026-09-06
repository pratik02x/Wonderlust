const express=require("express");
const router=express.Router();
const listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js")
const{listingSchema,reviewsSchema}=require("../Schema.js");
const methodOverride=require("method-override");
const ExpressError=require("../utils/ExpressError.js")



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


router.get("/",wrapAsync(async(req,res)=>{
   let listings= await listing.find({});
   res.render("listings/index.ejs",{listings});
}))

//show route --> a perticular list
router.get("/:id",wrapAsync(async(req,res)=>{
      let{id}=req.params;
      let list=await listing.findById(id).populate("reviews");
      if(!list){
        req.flash("error","List you are requesting is not exist!");
        return res.redirect("/listings");
      }
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

router.get("/add/newlist",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));



router.post("/add/newlist",validatelisting,wrapAsync(async (req,res,next)=>{
    

   
    
   let{title,description,image,price,location,country}=req.body;

    let list=new listing({
        title,
        description,
        image,
        price,
        location,
        country
    });
 
          await listing.insertOne(list);

    req.flash("success","New Listing Created!")
   res.redirect("/listings");

  

}));

//edit
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    let list=await listing.findById(id);
    if(!list){
        req.flash("error","List you are requesting for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
}))
//update
router.put("/:id/edit",validatelisting,wrapAsync(async (req,res)=>{
    let{id}=req.params;
    let{title,description,image,price,location,country}=req.body;
    await listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

//delete

router.delete("/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    let list=await listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted!")
    res.redirect("/listings");
}))

module.exports=router;
