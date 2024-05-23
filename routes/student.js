import express from "express"
import { insertStudent } from "../controller/student.js"

const router = express.Router()

router.route('/student').post(insertStudent).get((req,res)=>{
    res.json({message: "hello world!"})
})

export {router}