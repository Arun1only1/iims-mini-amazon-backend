import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const url =
      "mongodb+srv://iims:iims123@school.b5lva.mongodb.net/mini-amazon?retryWrites=true&w=majority&appName=School";

    await mongoose.connect(url);

    console.log("DB connection successful...");
  } catch (error) {
    console.log("DB connection failed...");
    console.log(error.message);
  }
};

export default dbConnect;
