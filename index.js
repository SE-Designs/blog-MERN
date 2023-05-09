import * as dotenv from "dotenv";

import { PostController, UserController } from "./controllers/index.js";
import { loginValidation, registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";
import express from "express";
import handleValErrors from "./utils/handleValErrors.js";
import mongoose from "mongoose";
import multer from "multer";
import { postCreateValidation } from "./validations/post.js";

dotenv.config();

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASS}@mern-blog.mmgvmgk.mongodb.net/blog?retryWrites=true&w=majority`
	)
	.then(() => console.log("DB ok"))
	.catch((err) => console.error("DB err: ", err));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "images");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const fileFilter = (_, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({ storage, fileFilter });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post(
	"/auth/sign-up",
	registerValidation,
	handleValErrors,
	UserController.signUp
);
app.post(
	"/auth/sign-in",
	loginValidation,
	handleValErrors,
	UserController.signIn
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValErrors,
	PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValErrors,
	PostController.update
);

app.use((error, req, res, next) => {
	const status = error.errorStatus || 500;
	const message = error.message;
	const data = error.data;
	console.log(message, status, error);
	res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
	if (err) {
		return console.error(err);
	}

	console.log(`Server running on port - ${PORT}`);
});
