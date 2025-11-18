import express from "express";
import dotenv from "dotenv";
import {connectDB} from "../config/db.js";
import Product from "../models/product.model.js";
import { mongo } from "mongoose";
dotenv.config();

const app = express();
app.use(express.json());
app.get("/api/products", async(req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({success:true, data: products });
    }catch(error){
        console.log("Error fetching products:", error.message);
        res.status(500).json({success:false, message: "Server Error" });
    }  
});
app.post("/api/products", async(req, res) => {
    const product = req.body;
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({success:false, message: "All fields are required" });
    }
    const newProduct = new Product(product);
    try{
        await newProduct.save();
        res.status(201).json({success:true, data: newProduct });
    }catch(error){
        console.log("Error creating product:", error.message);
        res.status(500).json({success:false, message: "Server Error" });
    }
});
app.put("/api/products/:id", async(req,res) =>{
    const {id}= req.params;
    const product = req.body;   
    if (! mongo.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success:false, message: "Invalid product ID" });
    }
    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});
        res.status(200).json({success:true, data: updatedProduct });
    }catch(error){
        res.status(500).json({success:false, message: "Server error" });
    }    
}   );
app.delete("/api/products/:id", async(req,res) =>{
    const {id}= req.params;
    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true, message: "Product deleted successfully" });
    }catch(error){
        res.status(404).json({success:false, message: "product not found" });
    }
})
app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:5000");

});
