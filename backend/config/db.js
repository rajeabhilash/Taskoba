const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {});
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
        process.exit(1);
    }
};

module.exports = connectDB;