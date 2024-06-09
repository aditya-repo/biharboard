import express from "express"
import { insertSingleRawStudent, rawStudentcount, studentAllDataCount } from "../controller/dashboard.js"
import { schoolWithRawStudentCount } from "../controller/school.js"

const router = express.Router()

router.route('/rawdata').get(rawStudentcount).post(insertSingleRawStudent)
router.route('/studentcount').get(rawStudentcount)
router.route('/student').get(studentAllDataCount)
router.route('/rawstudent').get(schoolWithRawStudentCount)

export {router}