import SchoolProfile from "../model/school.js";
import { v4 as uuidv4 } from 'uuid';

const allSchoolList = async (req, res) => {
    try {
        const response = await SchoolProfile.find({deleted: false})
        res.status(200).json(response)
    } catch (error) {
        res.status(500).send(error)
    }
}

const singleSchool = async (req, res) => {
    const query = { schoolcode: req.params.id ,deleted: false}
    try {
        const response = await SchoolProfile.findOne(query)
        if (!response) {
            return res.status(404).json({ "message": "School not found", "statuscode": "404" })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

const insertSchool = async (req, res) => {
    let data = req.body
    const uniqueId = uuidv4();
    data = {...data, schooluid: uniqueId}
    try {
        const school = new SchoolProfile(data)
        await school.save()
        res.status(200).json(school)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

const updateSchool = async (req, res) => {
    const schoolcode = req.params.id
    const data = req.body
    try {
        const response = await SchoolProfile.findOneAndUpdate({ schoolcode ,deleted: false}, data, {new:true})
        if (!response) {
            return res.status(400).json({ "message": "School not found" })
        }
        res.json(response).status(200)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

const deleteSchool = async (req, res) => {
    const schoolcode = req.params.id
    const changeFlag = { deleteflag: "true" }

    try {
        const response = await SchoolProfile.findOneAndUpdate({ schoolcode ,deleted: false}, changeFlag)
        if (!response) {
            return res.status(400).json({ "message": "School not found" })
        }
        res.status(200).json({ "message": "School deleted successfuly" })
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

export {allSchoolList, insertSchool, updateSchool, singleSchool, deleteSchool}