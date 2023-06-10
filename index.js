const express = require('express');
const { connection } = require('./db');
const { userRouter } = require('./routes/userRoutes');
const { authentication } = require('./middlewares/authMiddlewares');


const app = express();
app.use(express.json());

app.use("users", userRouter);
app.use(authentication);

app.listen(4400,async()=>{
    try {
        await connection
        console.log("Connected to the Database")
0    } catch (error) {
        console.log(error);
        console.log("Not Connected to the Database");
    }
    console.log("Server is running on port 4400")
})