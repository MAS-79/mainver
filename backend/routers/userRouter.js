import express from 'express';
import User from '../models/userModel';
// import Cart from '../models/cartModel'
import expressAsyncHandler from "express-async-handler";
import { generateToken, isAuth } from "../utils";
import { userCart } from '../controllers/user';
const userRouter = express.Router();


userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {   
    // console.log(req.body)
    // let orderdBy = "648c95a5135e130af6426bd2";
    const user = new User({ /*creating new user in database from frontend and passing following information that received from frontend body */
      
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      // orderdBy: orderdBy
    });
    const createdUser = await user.save();
    if (!createdUser) {
      res.status(401).send({
        message: 'Invalid User Data',
      });
    } else {
      res.send({ /*sending this new user's information to the frontend */
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
        
      });
    }
  })
);
userRouter.post(  /*sending request to database to get a user with this email and password */
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
      
      email: req.body.email,  /*frontned side pr jo email dali jye gi wo yaha hasil ho gi is k iye npm body-parser chahye*/
      password: req.body.password,
    });
    if (!signinUser) {
      res.status(401).send({
        message: "Invalid Email or Password",
      });
    }
    else {
      res.send({  /*database sy ye information ly ga and user ki information k sath aik token generate kr dy ga */
        _id: signinUser._id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: generateToken(signinUser),
      });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({
        message: 'User Not Found',
      });
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);

// userRouter.post('/localstorage', userCart)

export default userRouter;
