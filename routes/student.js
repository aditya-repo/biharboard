import express from "express"
import { allStudent, deleteStudent, insertStudent, pendingReview, pendingStudentProfile, singleStudent, studentWithApprovalStatus, studentWithApprovalStatusAndFormType, studentWithFormType, updateStudent } from "../controller/student.js"

const router = express.Router()

router.route('/').get(allStudent).post(insertStudent)
router.route('/pendingreview').get(pendingReview)
router.route('/pendingstudents/:id').get(pendingStudentProfile)
router.route('/approval/:id').get(studentWithApprovalStatus)
router.route('/formtype/:id').get(studentWithFormType)
router.route('/approvalformtype/:approvalid/:formid').get(studentWithApprovalStatusAndFormType)
router.route('/:id').get(singleStudent).post(updateStudent).put(updateStudent).delete(deleteStudent)

export {router}