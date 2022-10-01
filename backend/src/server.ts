import dotenv from 'dotenv';
dotenv.config();

import express, { request, response } from "express"; //it is necessary to install it on the terminal and then import it. It will be underlined and it is necessary to chose quickfix-> install it 
import cors from "cors"; //it is necessary to install it
import foodRouter from  "./routers/food.router";
import userRouter from  "./routers/user.router";
import { dbConnect } from './configs/database.config';
dbConnect();

const app = express();// Frontend is on localhost : 4200 and backend on localhost: 5000. By default it is not acceptable to have a request  from one address to a different address, thats is why we need cors.
app.use(express.json());//doesn't natively work with json. It is necessary to import it

app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.use("/api/foods", foodRouter)
app.use("/api/users", userRouter)


const port = 5000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})