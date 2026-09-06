const express=require("express");
const router=express.Router({mergeParams:true});

const Review=require("../models/Reviews.js");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const{listingSchema,reviewsSchema}=require("../Schema.js");
const Listing=require("../models/listings.js")
//Reviews
//post reviews
router.use(express.json());
router.use(express.urlencoded({extended:true}))
const validateReviews=(req,res,next)=>{
    let{error}=reviewsSchema.validate(req.body);
    if(error){
       let errMsg=error.details.map((el)=> el.message).join(",");
       throw new ExpressError("400",errMsg);
    }
    else{
        next();
    }
}

router.post("/",validateReviews,wrapAsync(async (req,res)=>{

    console.log(req.params.id);
      let listing=await Listing.findById(req.params.id);
      let{rating,comment}=req.body;

      let review=new Review({
        rating,
        comment
      });

      listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Review added!")
   res.redirect(`/listings/${req.params.id}`);
}))

//delete reviews

router.delete("/:reviewId",wrapAsync(async (req,res)=>{
        let{id,reviewId}=req.params;
         
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted!")
        res.redirect(`/listings/${id}`)
        
}))

module.exports=router;
