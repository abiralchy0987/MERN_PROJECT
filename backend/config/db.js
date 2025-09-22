import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/khajasathi')
        .then(() => {
            console.log('Connected with mongodb!')

            // app.listen(4000, () => {
            //     console.log("Listening at port 4000")
            // })
        })
        .catch(error => console.log(error));
};

export default connectDB;
