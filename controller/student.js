import { Student } from "../model/student.js"
import { v4 as uuidv4 } from 'uuid';

const allStudent = async (req, res) => {
    try {
        const response = await Student.find({deleteflag: false})
        res.status(200).json(response)
    } catch (error) {
        res.status(500).send(error)
    }
}

const singleStudent = async (req, res) => {
    const query = { studentuid: req.params.id ,deleteflag: false}
    try {
        const response = await Student.findOne(query)
        if (!response) {
            return res.status(404).json({ "message": "user not found", "statuscode": "404" })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

const insertStudent = async (req, res) => {
    let data = req.body
    const uniqueId = uuidv4();
    data = {...data, studentuid: uniqueId}
    try {
        const student = new Student(data)
        await student.save()
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

const updateStudent = async (req, res) => {
    const studentuid = req.params.id
    const data = req.body
    try {
        const response = await Student.findOneAndUpdate({ studentuid ,deleteflag: false}, data, {new:true})
        if (!response) {
            return res.status(400).json({ "message": "Student not found" })
        }
        res.json(response).status(200)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

const deleteStudent = async (req, res) => {
    const studentuid = req.params.id
    const changeFlag = { deleteflag: "true" }

    try {
        const response = await Student.findOneAndUpdate({ studentuid ,deleteflag: false}, changeFlag)
        if (!response) {
            return res.status(400).json({ "message": "Student not found" })
        }
        res.status(200).json({ "message": "Student deleted successfuly" })
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}


export { insertStudent, allStudent, singleStudent, updateStudent, deleteStudent }