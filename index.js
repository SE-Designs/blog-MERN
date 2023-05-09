import * as PostController from "./controllers/PostController.js";
import * as UserController from "./controllers/UserController.js";
import * as dotenv from "dotenv";

import { loginValidation, registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";
import bcrypt from "bcrypt";
import checkAuth from "./utils/checkAuth.js";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { postCreateValidation } from "./validations/post.js";
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

app.post("/auth/sign-in", loginValidation, UserController.signUp);
app.post("/auth/sign-up", registerValidation, UserController.signIn);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

app.listen(3000, (err) => {
	if (err) {
		return console.error(err);
	}

	console.log("starting server at port 3000");
});
