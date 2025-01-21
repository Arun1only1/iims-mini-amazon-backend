import express from "express";
import UserTable from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// register
router.post("/user/register", async (req, res) => {
  //   extract new user from req.body
  const newUser = req.body;

  // find user with provided email
  const user = await UserTable.findOne({ email: newUser.email });

  // if user exists, throw error
  if (user) {
    return res.status(409).send({ message: "Email already exists." });
  }

  // hash
  // requirement => plain password, salt rounds
  const plainPassword = newUser.password;
  const saltRounds = 10; //randomness
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  // replace plain password by hashed password
  newUser.password = hashedPassword;

  await UserTable.create(newUser);

  return res.status(201).send({ message: "User is registered successfully." });
});

// login route
router.post("/user/login", async (req, res) => {
  // extract login credentials from req.body
  const loginCredentials = req.body;

  // find user with provided email
  const user = await UserTable.findOne({ email: loginCredentials.email });

  // if not user,throw error
  if (!user) {
    return res.status(404).send({ message: "Invalid credentials." });
  }

  // password check
  // need to compare plain password with hashed password
  // plain password is provided by user
  // hashed password is saved in db
  const plainPassword = loginCredentials.password;
  const hashedPassword = user.password;

  const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

  if (!isPasswordMatch) {
    return res.status(404).send({ message: "Invalid credentials." });
  }

  // remove password
  user.password = undefined;

  //  generate access token
  // secretkey
  const secretKey = "ahjdfahdajkfdhdjfashj";

  // payload => object inside token
  const payload = { email: user.email };

  // encrypted cipher text
  const token = jwt.sign(payload, secretKey, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .send({ message: "success", userDetails: user, accessToken: token });
});

export { router as userController };
