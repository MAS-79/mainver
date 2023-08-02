const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var cartSchema = new mongoose.Schema(
  { 
    // _id: { type: String  },
    products:[
         {
        model: String,
        name: String,
        image:String,
        price:Number,
        countInStock:  Number,
        product: String,
        // type: ObjectId,
        // ref: "Product",
        qty:Number,
        _id: String,
         }
    ],
    itemsPrice: Number,
    taxPrice: Number,
    shippingPrice: Number,
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderdBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);