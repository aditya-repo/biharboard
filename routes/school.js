import express from "express"
import { allSchoolList, deleteSchool, insertSchool, singleSchool, updateSchool } from "../controller/school.js"

const router = express.Router()

router.route('/').get(allSchoolList).post(insertSchool)
router.route('/:id').get(singleSchool).post(updateSchool).put(updateSchool).delete(deleteSchool)

export {router}