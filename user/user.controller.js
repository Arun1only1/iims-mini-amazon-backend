import express from "express";
import UserTable from "./user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/user/register", async (req, res) => {
  //   extract new user from req.body
  const newUser = req.body;

  // hash password
  // plain password, saltRounds
  const plainPassword = newUser.password;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  //   replace plain password by hashed password
  newUser.password = hashedPassword;

  await UserTable.create(newUser);

  return res.status(201).send({ message: "User is registered successfully." });
});

export { router as userController };
