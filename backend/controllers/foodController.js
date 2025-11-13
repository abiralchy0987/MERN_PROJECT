import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

//add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Item Added" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add food item" });
  }
};
// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const host = req.protocol + '://' + req.get('host');

    // list files on disk once
    let filesOnDisk = [];
    try {
      filesOnDisk = fs.readdirSync(uploadsDir);
    } catch (err) {
      // ignore; filesOnDisk stays empty
      filesOnDisk = [];
    }

    const mapped = foods.map((f) => {
      const obj = f.toObject ? f.toObject() : { ...f };
      const img = obj.image;
      let imageUrl = null;

      if (img) {
        // if exact file exists, use it
        if (filesOnDisk.includes(img)) {
          imageUrl = `${host}/images/${img}`;
        } else {
          // try to find a file that ends with `-food_N.png` where N matches img's suffix
          const match = img.match(/food_?(\d+)\.png$/i);
          if (match) {
            const n = match[1];
            const alt = filesOnDisk.find((fn) => fn.toLowerCase().endsWith(`-food_${n}.png`));
            if (alt) imageUrl = `${host}/images/${alt}`;
          }
        }
      }

      // if no image found, leave imageUrl null so client falls back to local asset
      if (!imageUrl) imageUrl = null;

      return { ...obj, imageUrl };
    });

    res.json({ success: true, data: mapped });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve food items" });
  }
};

//remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Item remove" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove food item" });
  }
};
export { addFood, listFood, removeFood };
