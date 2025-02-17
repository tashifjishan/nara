const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A product must have a title"],
        minlength: [10, "Title must be at least 10 characters"],
        maxlength: [100, "Title must not exceed 100 characters"],
    },
    description: {
        type: String, 
        required: [true, "A product must have a description"],
        minlength: [100, "Product description must not be less than 100 characters"],
        maxlength: [500, "Produdct description must not exceed 500 characters"]
    },
    price: {
        type: String,
        required: [true, "A product must have a price"]
    },
    currency: {
        type: String,
        default: "INR"
    },
    sizes: {
        type: [String],
        validate: [
            (sizes)=>{ return sizes && sizes.length>0},
            "A product must have at least one size"
        ]
    },
    images: {
        type: [String],
        required: [true, "A product must have one or more related images"]
    }
    

});

const Product =  mongoose.model("product", ProductSchema);

module.exports = Product;