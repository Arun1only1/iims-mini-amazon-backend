import mongoose from "mongoose";

// set rule/schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  gender: String,
  phoneNumber: String,
  address: String,
});

// create table/model/collection
const UserTable = mongoose.model("User", userSchema);

export default UserTable;

// user table
// _id
// fullName
// email
// password
// gender
// phoneNumber
// address
