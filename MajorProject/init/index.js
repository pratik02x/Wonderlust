const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../models/listings");
const {data}=require("./data");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
};

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

const initDB=async ()=>{
     await Listing.deleteMany({});
     await Listing.insertMany(data);
     console.log("data initialized!");
}
initDB();