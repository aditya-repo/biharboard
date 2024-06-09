// Imports
import express from "express";
import { database } from "./model/index.js"
import dotenv from "dotenv";
import { router as studentRouter} from "./routes/student.js"
import { router as schoolRouter} from "./routes/school.js"
import { router as dashboardRouter} from "./routes/dashboard.js"
import cors from 'cors'

dotenv.config();

// Configuration Data
const DBURL = process.env.DBURL
const PORT = process.env.PORT || 4000;

// Database Connection
database(DBURL)

const app = express();

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))

// Routes
app.use('/student' ,studentRouter)
app.use('/school' ,schoolRouter)
app.use('/dashboard' ,dashboardRouter)

// Application started
app.listen(4040, () => {
  console.log(`Server started on PORT : ${PORT}`);
})