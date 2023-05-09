import * as UserController from "./controllers/UserController.js";
import * as dotenv from "dotenv";

import UserModel from "./models/User.js";
import bcrypt from "bcrypt";
import checkAuth from "./utils/checkAuth.js";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";

dotenv.config();

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASS}@mern-blog.mmgvmgk.mongodb.net/blog?retryWrites=true&w=majority`
	)
	.then(() => console.log("DB ok"))
	.catch((err) => console.error("DB err: ", err));

const app = express();

app.use(express.json());

app.post("/auth/sign-in", UserController.signUp);

app.post("/auth/sign-up", registerValidation, UserController.signIn);

app.get("/auth/me", checkAuth, UserController.getMe);

app.listen(3000, (err) => {
	if (err) {
		return console.error(err);
	}

	console.log("starting server at port 3000");
});
