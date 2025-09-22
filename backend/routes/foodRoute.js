import express from "express";
import { addFood } from '../controllers/foodController.js'
import multer from "multer";
import path from "path";


const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), foodController.addFood);

export default foodRouter;