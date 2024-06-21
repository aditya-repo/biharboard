import express from "express"
import { allSchoolList, deleteSchool, insertSchool, schoolWithStudentCount, schoolWithStudentTotalData, singleSchool, updateSchool, studentPendingDataList, singleSchoolStudentLists, generateBarcode, studentWithRawDataImportedFalse, schoolWithRawStudentCountImportFalse, schoolWithRawStudentCountImportTrue, studentWithRawDataImportedTrue } from "../controller/school.js"

const router = express.Router()

router.route('/').get(allSchoolList).post(insertSchool)
router.route('/student-data').get(schoolWithStudentTotalData)
router.route('/student-count').get(schoolWithStudentCount)
router.route('/rawschoollist').get(schoolWithRawStudentCountImportTrue)
router.route('/rawschoollistfalse').get(schoolWithRawStudentCountImportFalse)
router.route('/rawstudentlist/:id').get(studentWithRawDataImportedTrue)
router.route('/rawstudentlistfalse/:id').get(studentWithRawDataImportedFalse)
router.route('/:id').get(singleSchool).post(updateSchool).put(updateSchool).delete(deleteSchool)
router.route('/pendingstudentlist/:id').get(studentPendingDataList)
router.route('/student/:id').get(singleSchoolStudentLists)
router.route('/barcode/:id').get(generateBarcode)

export {router}