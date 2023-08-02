import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
  
  name: { type: String },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  orderdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart'},
  products:[
    {
   // _id: {type: String},
   model: String,
   name: String,
   price:Number,
   countInStock:  Number,
   // image: String,
   product: String,
   // type: ObjectId,
   // ref: "Product",
   qty:Number,
   _id: String,
    }
],
userTotal: Number,
 // orderdBy: { type: ObjectId, ref: "Cart" },
},
{ timestamps: true }

);

// userSchema.methods.addToCart = function(allData){
//   // console.log('All Data is here:', allData)
//   let cart =this.cart;
//   if(cart.items.length == 0){
//     cart.items.push({productId:allData._id, qty:1});
//     cart.totalPrice = allData.price; 
//   }else{

//   }
// //  console.log('User in Schema: ', this)
// }


module.exports = mongoose.model("User", userSchema);

