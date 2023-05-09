import * as dotenv from "dotenv";

import UserModel from "./models/User.js";
import bcrypt from "bcrypt";
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

app.post("/auth/sign-up", registerValidation, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	const password = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(password, salt);

	const doc = new UserModel({
		email: req.body.email,
		fullName: req.body.fullName,
		avatarUrl: req.body.avatarUrl,
		passwordHash,
	});

	const user = await doc.save();

	res.json(user);
});

app.listen(3000, (err) => {
	if (err) {
		return console.error(err);
	}

	console.log("starting server at port 3000");
});
