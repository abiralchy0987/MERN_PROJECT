import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';

//app config
const app = express();
const port = 4000;

//middlewares
app.use(cors());
app.use(express.json());


//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
// serve uploads using absolute path so static files resolve regardless of cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, 'uploads'))); // to access images statically
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)


app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

