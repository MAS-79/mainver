import mongoose from 'mongoose';
// const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    condition: { type: String, required: true },
    image: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
    image4: { type: String, required: true },
    warranty: { type: String, required: true },
    price: { type: Number, default: 0.0, required: true },
    offerprice: { type: Number, default: 0.0, required: true },
    countInStock: { type: Number, default: 0 },
    rating: { type: Number, default: 0.0, required: true },
    numReviews: { type: Number, default: 0, required: true },
    productcode: { type: Number, default: 0, required: true },
    
  },
  { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);