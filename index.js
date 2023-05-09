import express from "express";

const app = express();

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, (err) => {
	if (err) {
		return console.error(err);
	}

	console.log("starting server at port 3000");
});
