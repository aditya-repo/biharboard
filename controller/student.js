import SchoolProfile from "../model/school.js";
import { Student } from "../model/student.js"
// import { v4 as uuidv4 } from 'uuid';

const allStudent = async (req, res) => {
    try {
        const response = await Student.find({deleted: "false"})
    // console.log(response);
        res.status(200).json(response)
    } catch (error) {
        res.status(500).send(error)
    }
}

// const singleStudent = async (req, res) => {
//     const query = { studentuid: req.params.id ,deleted: false}
//     try {
//         const response = await Student.findOne(query)
//         if (!response) {
//             return res.status(404).json({ "message": "user not found", "statuscode": "404" })
//         }
//         console.log(response);
//         res.status(200).json(response)
//     } catch (error) {
//         res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
//     }
// }
const singleStudent = async (req, res) => {
    const query = { studentuid: req.params.id ,deleted: "false"}
    try {
        let r = await Student.findOne(query)
        if (!r) {
            return res.status(404).json({ "message": "user not found", "statuscode": "404" })
        }
        res.status(200).json(r)
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    }
}

const insertStudent = async (req, res) => {
    let data = req.body
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

const pendingReview = async (req,res)=>{
    const response = await SchoolProfile.aggregate([
        {
          $lookup: {
            from: 'students',
            localField: 'schoolcode',
            foreignField: 'schoolcode',
            as: 'students',
          },
        },
        {
          $addFields: {
            studentCount: { $size: '$students' },
            pendingCount: {
              $size: {
                $filter: {
                  input: '$students',
                  cond: { $and: [{ $eq: ['$$this.approval', 'false'] }, { $eq: ['$$this.deleted', 'false'] }] },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1, // Include specific fields from SchoolProfile model
            schooluid: 1,
            schoolcode: 1,
            schoolname: 1,
            district: 1,
            pincode: 1,
            principal: 1,
            mobile: 1,
            mobile2: 1,
            email: 1,
            deleted: 1,
            studentCount: 1,
            pendingCount: 1,
          },
        },
      ]);
      
      try {
        console.log(response);
        res.json(response);
      } catch (err) {
        console.error(err);
      }
    }
  
const pendingStudentProfile = async (req, res)=>{
    const {id} = req.params
        const pendingStudents = await Student.find({
            approval: 'false',
            deleted: 'false',
            studentuid: id
          });
          
          try {
            res.json(pendingStudents);
          } catch (err) {
            console.error(err);
          }
    }
  
export { insertStudent, allStudent, singleStudent, updateStudent, deleteStudent, pendingReview, pendingStudentProfile }