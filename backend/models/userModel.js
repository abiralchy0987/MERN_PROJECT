import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    name:{ type: String, required: true },
    // allow either email or phone as identifier. Make unique sparse so optional fields don't conflict.
    email:{ type: String, unique: true, sparse: true },
    phone:{ type: String, unique: true, sparse: true },
    password:{ type: String, required: true },
        cartData:{type:Object, default:{}},
    },{minimize:false}
)

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
