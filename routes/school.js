import express from "express"
import { allSchoolList, deleteSchool, insertSchool, schoolWithStudentCount, schoolWithStudentTotalData, singleSchool, updateSchool,schoolWithRawStudentCount, studentWithRawData, studentPendingDataList, singleSchoolStudentLists, generateBarcode } from "../controller/school.js"

const router = express.Router()

router.route('/').get(allSchoolList).post(insertSchool)
router.route('/student-data').get(schoolWithStudentTotalData)
router.route('/student-count').get(schoolWithStudentCount)
router.route('/rawschoollist').get(schoolWithRawStudentCount)
router.route('/rawstudentlist/:id').get(studentWithRawData)
router.route('/:id').get(singleSchool).post(updateSchool).put(updateSchool).delete(deleteSchool)
router.route('/pendingstudentlist/:id').get(studentPendingDataList)
router.route('/student/:id').get(singleSchoolStudentLists)
router.route('/barcode/:id').get(generateBarcode)

export {router}