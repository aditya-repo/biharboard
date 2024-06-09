import express from "express"
import { allStudent, deleteStudent, insertStudent, pendingReview, pendingStudentProfile, singleStudent, updateStudent } from "../controller/student.js"

const router = express.Router()

router.route('/').get(allStudent).post(insertStudent)
router.route('/pendingreview').get(pendingReview)
router.route('/pendingstudents/:id').get(pendingStudentProfile)
router.route('/:id').get(singleStudent).post(updateStudent).put(updateStudent).delete(deleteStudent)

export {router}