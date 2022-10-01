

import { Router } from 'express';
import { sample_users } from '../data';
import jwt from  "jsonwebtoken"; //it is necessary to install it
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../Constants/http_status';
import bcrypt from 'bcryptjs';

const router = Router();

router.get("/seed", asyncHandler(
    async (re, res) => { 
        const usersCount = await UserModel.countDocuments();
        if(usersCount > 0){
            res.send("Seed is already done");
            return;
        }

        await UserModel.create(sample_users);
        res.send("Seed is done");
}))

//Api to login
router.post("/login", asyncHandler (
    async (req, res) => {    
    const {email , password} = req.body; // You can unpack it - it is called destructuring assignment
    const user = await UserModel.findOne({email, password});
    if(user){
        res.send(generateTokenResponse(user));
    }
    else{
        res.status(HTTP_BAD_REQUEST).send("User name or password is not valid!");
    }
}))

//Api to register new user
router.post('/register', asyncHandler(
    async (req, res) => {
      const {name, email, password, address} = req.body;
      const user = await UserModel.findOne({email});
      if(user){
        res.status(HTTP_BAD_REQUEST)
        .send('User is already exist, please login!');
        return;
      }
  
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      const newUser:User = {
        id:'',
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        address,
        isAdmin: false
      }
  
      const dbUser = await UserModel.create(newUser);
      res.send(generateTokenResponse(dbUser));
    }
  ))


// a token is an encripted text that will be sent to the client and need to be saved there and be sent in each user request so the server could decript it and understand wich user is sending tha request
// token - encripted text used for authentication and authorization
const generateTokenResponse = (user:any) => {
    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin}, "SomeRandomText", {expiresIn :"30d"}
    ) // the "SomeRandomText" is the private key. Normally it is kept in the emv file for security as it is used to decode the token. This is just for demonstration
    user.token = token;
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
      };
    }

export default router;