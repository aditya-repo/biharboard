import express from "express"
import { allStudent, deleteStudent, insertStudent, singleStudent, updateStudent } from "../controller/student.js"

const router = express.Router()

router.route('/').get(allStudent).post(insertStudent)
router.route('/:id').get(singleStudent).post(updateStudent).put(updateStudent).delete(deleteStudent)

export {router}