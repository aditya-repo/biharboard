import express from "express";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello Kaushal!" });
});

app.listen(4040, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
