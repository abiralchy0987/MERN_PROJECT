import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      'mongodb+srv://abiral221702_db_user:2002@cluster0.xuwfzws.mongodb.net/khanaghar'
    )
    .then(() => console.log("DB Connected"));
}
