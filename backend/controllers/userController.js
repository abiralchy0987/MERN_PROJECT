import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// login user (accepts email or phone in `identifier`)
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    if (!identifier || !password) return res.json({ success: false, message: "Missing credentials" });
    const user = await userModel.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    //create token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// get logged in user profile
const getUserProfile = async (req, res) => {
  try {
    // diagnostic log: don't print token value, just whether it's present
    console.log("getUserProfile called - token present:", !!req.headers.token);
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user (accepts single `identifier` which may be email or phone)
const registerUser = async (req, res) => {
  const { name, identifier, password } = req.body;

  try {
    if (!identifier || !password || !name) return res.json({ success: false, message: "Missing fields" });

    let email = null;
    let phone = null;
    if (validator.isEmail(identifier)) {
      email = identifier;
    } else if (validator.isMobilePhone(identifier, 'any')) {
      phone = identifier;
    } else {
      return res.json({ success: false, message: "Enter a valid email or phone number" });
    }

    //checking user already exists
    const exists = await userModel.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.json({ success: false, message: "user already exists" });
    }

    // validate phone if present
    if (phone && !validator.isMobilePhone(phone, 'any')) {
      return res.json({ success: false, message: "Enter valid phone number" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter strong password" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating user
    const newUser = new userModel({ name, email, phone, password: hashedPassword });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser, getUserProfile };
