const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const https = require('https');
const querystring = require('querystring');

exports.userCart = async (req, res) => {
  // console.log("Getting data here:",  req.body); // {cart: []}
  let  cart  = await req.body;
  // console.log("Here are Cart Items:", cart);
  // Getting Carts Products 
  let products = [];
  for(var i=0; i < cart.length; i++){
    products.push({product: cart[i]["product"],  name: cart[i]["name"], model: cart[i]["model"], image: cart[i]["image"], price: cart[i]["price"], qty: cart[i]["qty"]  });
  }
  // console.log("Products Extracting Function: ======= :", products);
  let popedObject = products.pop()
  
  //Getting Id Of User;
  let idExtrect = [];
  for(var i=0; i < cart.length; i++){
    idExtrect.push({_id: cart[i]["_id"] });
  }
  let user = idExtrect.pop();
 
//  console.log("Here are PRODUCTS:", products);
// CREATING CART INSIDE MONGOOSE,TOTAL PRICE OF CART, AVOIDING FOR DUPLICATION OF CART IN MONGOOSE.
//If That user have an account in DB
const checkUser = user._id;
// console.log("Current User:", checkUser);
let findUserDb = await User.findById(checkUser).exec();
    if (!findUserDb) {
        res.status(401).send({
          message: "User Not Found , SIGN-UP.."
        });
    }else {
        //Checking if Cart of that User exist or not 
        let cartAvlUser = await Cart.findOne({orderdBy: user._id}).exec();
          if(!cartAvlUser){
            let itemsPrice = 0;
            for (let i = 0; i < products.length; i++) {
              itemsPrice = itemsPrice + products[i].price * products[i].qty;
            }
            const shippingPrice = itemsPrice > 150 ? 0 : 17;
            const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
            let cartTotal = itemsPrice + shippingPrice + taxPrice;
                // console.log("Total Value:", cartTotal)
                let totalAfterDiscount =0;
                  let newCart = await new Cart({
                    products,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    cartTotal,
                    totalAfterDiscount,
                    orderdBy: user._id,
                  }).save();
                  // console.log("new cart", newCart);
                  res.json({ ok: true })
          }else{
            // console.log("Cart Available", cartAvlUser);
              cartAvlUser.deleteOne()
              console.log("removed old cart");
              //Creating New after deleting
              let itemsPrice = 0;
              for (let i = 0; i < products.length; i++) {
                itemsPrice = itemsPrice + products[i].price * products[i].qty;
              }
              const shippingPrice = itemsPrice > 150 ? 0 : 17;
              const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
              let cartTotal = itemsPrice + shippingPrice + taxPrice;

              // console.log("Total Value:", cartTotal)
              let totalAfterDiscount =0;
                let newCart = await new Cart({
                  products,
                  itemsPrice,
                  taxPrice,
                  shippingPrice,
                  cartTotal,
                  totalAfterDiscount,
                  orderdBy: user._id,
                }).save();
                // console.log("new cart", newCart);
                res.json({ ok: true });           
        }

    }
};

exports.cartCheckout = async (req, res) => {
 
  let  findCart  = await req.body;
  // console.log("Full Cart data:" ,findCart);
  //Checking cart availablity of that user before placing an order.
  let cartAvlUser = await Cart.findOne({orderdBy: findCart._id}).populate('orderdBy');
  // console.log("Full Cart data:" ,cartAvlUser);


  let cart = cartAvlUser.cartTotal;
  const roundOff = Math.trunc(cart)
  
  let setEntityId = ''
  if(findCart.paymentMethd !== 'mada'){
    setEntityId = '8ac7a4c888e7d6340188f18a15a90808'
  }else{
    setEntityId = '8ac7a4c888e7d6340188f18a8fa7080c'
  }


  const request = async () => {
	const path='/v1/checkouts';

	const checkOut = {
    'entityId':`${setEntityId}`,
		'amount': roundOff,
		'currency':'SAR',
		'paymentType':'DB',
    // 'testMode': 'EXTERNAL',
    'customParameters[3DS2_enrolled]':'true',
    'merchantTransactionId':'64879d8ba71bd06ceffd52b6',
    'customer.email': 'abc@gamil.com',
    'billing.street1': 'Al malaz ',
    'billing.city':'Riyadh',
    'billing.state':'Riyadh',
    'billing.country':'SA',
    'billing.postcode': '12629',
    'customer.givenName': 'Belal',
    'customer.surname':'Salous'        
	};

  let data = querystring.stringify(checkOut)
  
	const options = {
		port: 443,
		host: 'eu-test.oppwa.com',
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length,
			'Authorization':'Bearer OGFjN2E0Yzg4OGU3ZDYzNDAxODhmMTg5YTU2YzA4MDR8NXJiTjlQaEYyVA=='
		}
	};
 
	return new Promise((resolve, reject) => {
		const postRequest = https.request(options, function(res) {
			const buf = [];
			res.on('data', chunk => {
				buf.push(Buffer.from(chunk));
			});
			res.on('end', () => {
				const jsonString = Buffer.concat(buf).toString('utf8');
				try {
					resolve(JSON.parse(jsonString));
				} catch (error) {
					reject(error);
				}
			});
		});
		postRequest.on('error', reject);
		postRequest.write(data);
		postRequest.end();
	});
  
  };
  // request().then(console.log).catch(console.error);
  res.send(await request().then((the) =>  the))
  // request().then((the) => console.log("Result:", the));
};

exports.paymentResp = async (req, res) => {
  
  let  findCart  = await req.params.id;
  // console.log("Find It:", findCart )
  let checkOutId = findCart.slice(0, -4);
  // console.log("checkOutId: ",checkOutId); 
  
  let paymentMeth = findCart.slice(-4);
  // console.log("lastFour Place :: ",paymentMeth);
  
  let setEntityId = ''
  if(paymentMeth !== 'mada'){
    setEntityId = '8ac7a4c888e7d6340188f18a15a90808'
  }else{
    setEntityId = '8ac7a4c888e7d6340188f18a8fa7080c'
  }


const request = async () => {
	var path=`/v1/checkouts/${checkOutId}/payment`;
	path += `?entityId=${setEntityId}`;
	const options = {
		port: 443,
		host: 'test.oppwa.com',
		path: path,
		method: 'GET',
		headers: {
			'Authorization':'Bearer OGFjN2E0Yzg4OGU3ZDYzNDAxODhmMTg5YTU2YzA4MDR8NXJiTjlQaEYyVA=='
		}
	};
	return new Promise((resolve, reject) => {
		const postRequest = https.request(options, function(res) {
			const buf = [];
			res.on('data', chunk => {
				buf.push(Buffer.from(chunk));
			});
			res.on('end', () => {
				const jsonString = Buffer.concat(buf).toString('utf8');
				try {
					resolve(JSON.parse(jsonString));
				} catch (error) {
					reject(error);
				}
			});
		});
		postRequest.on('error', reject);
		postRequest.end();
	});
};
res.send(await request().then().catch());
// request().then(console.log).catch(console.error);


};


exports.productUpdate = async (req, res) => {
 const  soldItem  =await req.body;
  // const soldItemId = soldItem.map(async(x)=>x.product)
  const soldItemId = soldItem.product;
  // console.log("ReqBody: ",soldItemId);
  // const productId = req.params.id;
  const product = await Product.findById(soldItemId);
  if (!product) {
  res.status(401).send({
    message: "Your Cart is Empty.",
  });
  }else{
    // const soldQty = soldItem.map(async(x)=>x.qty);
  const soldQty = soldItem.qty;
  if(product.countInStock < soldQty ){
    res.status(401).send({
      message: "One or more items are less then your Purchased, Other items purchased successfully.  "
    })
  }else{
    const availQty = product.countInStock - soldQty;
     product.countInStock = availQty
     const updatedProduct = await product.save();
    res.send({
      updatedProduct   
    })
  }

  }

}


