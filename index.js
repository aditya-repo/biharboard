// Imports
import express from "express";
import { database } from "./model/index.js";
import dotenv from "dotenv";
import { router as studentRouter } from "./routes/student.js";
import { router as schoolRouter } from "./routes/school.js";
import { router as dashboardRouter } from "./routes/dashboard.js";
import { router as imageRouter } from "./routes/image.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Use fileURLToPath to get the current file name and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Data
const DBURL = process.env.DBURL;
const PORT = process.env.PORT || 4000;

// Database Connection
database(DBURL);

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/barcode", express.static(path.join(__dirname, "barcodes")));

app.use(
  "/form",
  express.static(path.join(__dirname, "assets", "applications"))
);

// Routes
app.use("/student", studentRouter);
app.use("/school", schoolRouter);
app.use("/dashboard", dashboardRouter);
app.use("/image", imageRouter);

// Application started
app.listen(4040, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
