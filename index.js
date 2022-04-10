import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import auth from "./routes/auth.js";

//App config
const app = express();
const port = process.env.PORT || 9000;

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/auth", auth);

// //Connect DB
// const connection_url =
//   "mongodb+srv://Hadi258:Haider123@memoriesproject.pb0kb.mongodb.net/Auth?retryWrites=true&w=majority";
// mongoose
//   .connect(connection_url, {})
//   .then(
    
//   )
//   .catch((error) => {
//     console.log(error.message);
//   });

 //app Listener
  app.listen(port, () => {
    console.log(`server is listening on localhost: ${port}`);
  })