const mongoose = require("mongoose");

const connectDB = async () =>{

    await mongoose.connect(
    "mongodb+srv://shubhamy4417:Y8gjYwH3JPUwy00X@cluster0.d1pfttf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
};

module.exports = connectDB;

