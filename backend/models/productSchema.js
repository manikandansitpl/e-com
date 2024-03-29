const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String
        },
        price: {
            mrp: {
                type: Number
            },
            cost: {
                type: Number
            },
            discountPercent: {
                type: Number
            }
        },
        subcategory: {
            type: String
        },
        brand:String,
        Size:String,
        type:String,
        color:String,
        AgeGroup:String,
        title:String,
        ram:String,
        rom:String,
        productImage: {
            type: String
        },
        productImage1:String,
        productImage2:String,
        productImage3:String,
        category: {
            type: String
        },
        description: {
            type: String
        },
        tagline: {
            type: String
        },
        quantity: {
            type: Number,
            default: 1
        },
        reviews: [
            {
                rating: {
                    type: Number,
                },
                comment: {
                    type: String,
                },
                reviewer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "customer",
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'seller'
        },
    }, { timestamps: true });

module.exports = mongoose.model("product", productSchema)