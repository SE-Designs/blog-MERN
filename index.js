import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
	.connect(
		`mongodb+srv://mix:<password>@mern-blog.mmgvmgk.mongodb.net/?retryWrites=true&w=majority`
	)
	.then(() => console.log("DB ok"))
	.catch((err) => console.error("DB err: ", err));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/auth/login", (req, res) => {
	console.log(req.body);

	const token = jwt.sign(
		{
			email: req.body.email,
			fullName: "mixturegg",
		},
		"iamsecretkey"
	);

	res.json({
		login: "mixture",
		success: true,
	});
});

app.listen(3000, (err) => {
	if (err) {
		return console.error(err);
	}

	console.log("starting server at port 3000");
});
