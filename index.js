// Imports
import express from "express";
import { database } from "./model/index.js"
import dotenv from "dotenv";
// import { insertStudent } from "./controller/student.js";
import { router as studentRouter} from "./routes/student.js"
dotenv.config();

// Configuration Data
const DBSTRING = process.env.DBSTRING
const PORT = process.env.PORT || 4000;

// Database connection
database(DBSTRING)

const app = express();

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Routes
// app.get("/", (req, res) => {
//   res.json({ message: "Hello Kaushal!" });
// });

app.use('/' ,studentRouter)


// Application started
app.listen(4040, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
