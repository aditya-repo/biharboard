import RawData from "../model/rawstudent.js";
import { Student } from "../model/student.js";

const rawStudentcount = async (req,res) => {
    try {
        const count = await RawData.countDocuments();
        res.json(count)
      } catch (err) {
        console.error('Error counting matching documents:', err);
      }
  }

const studentAllDataCount = async (req,res) => {
    try {
        const response = await Student.find();
        let data = {};
        const approvedAutoCount = response.filter(doc => doc.approval === 'auto' && doc.deleted === 'false').length;
        data = { ...data, auto: approvedAutoCount };
    
        const approvedCount = response.filter(doc => doc.approval === 'true' && doc.deleted === 'false').length;
        data = { ...data, approved: approvedCount };
    
        const pendingCount = response.filter(doc => doc.approval === 'false' && doc.deleted === 'false').length;
        data = { ...data, pending: pendingCount };
    
        data = { ...data, total: response.length };
    
        res.json(data)
      } catch (err) {
        console.error('Error counting matching documents:', err);
      }

}


const insertSingleRawStudent = async (req, res) => {
    let data = req.body
    // const uniqueId = uuidv4();
    // data = {...data, studentuid: uniqueId}
    try {
        const student = new RawData(data)
        await student.save()
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}


  export {
    rawStudentcount,
    insertSingleRawStudent,
    studentAllDataCount
  }