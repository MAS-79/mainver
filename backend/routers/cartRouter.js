import express from 'express';
import expressAysncHandler from 'express-async-handler';
// import Cart from '../models/cartModel';
import User from '../models/userModel';
const cartRouter = express.Router();
const { userCart,  cartCheckout, paymentResp } = require("../controllers/user");
const https = require('https');
const querystring = require('querystring');


cartRouter.post('/create', userCart)
cartRouter.post('/findcart', cartCheckout)
cartRouter.get('/cartpayment/:id', paymentResp)

// const request = async () => {
// 	var path=`/v1/checkouts/B38344C4190997ADB00582F1DC2095E6.uat01-vm-tx04/payment`;
// 	path += '?entityId=8ac7a4c888e7d6340188f18a8fa7080c';
// 	const options = {
// 		port: 443,
// 		host: 'test.oppwa.com',
// 		path: path,
// 		method: 'GET',
// 		headers: {
// 			'Authorization':'Bearer OGFjN2E0Yzg4OGU3ZDYzNDAxODhmMTg5YTU2YzA4MDR8NXJiTjlQaEYyVA=='
// 		}
// 	};
// 	return new Promise((resolve, reject) => {
// 		const postRequest = https.request(options, function(res) {
// 			const buf = [];
// 			res.on('data', chunk => {
// 				buf.push(Buffer.from(chunk));
// 			});
// 			res.on('end', () => {
// 				const jsonString = Buffer.concat(buf).toString('utf8');
// 				try {
// 					resolve(JSON.parse(jsonString));
// 				} catch (error) {
// 					reject(error);
// 				}
// 			});
// 		});
// 		postRequest.on('error', reject);
// 		postRequest.end();
// 	});
// };

// request().then(console.log).catch(console.error);


















  export default cartRouter;


