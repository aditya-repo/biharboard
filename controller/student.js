import RawData from "../model/rawstudent.js";
import SchoolProfile from "../model/school.js";
import { Student } from "../model/student.js"
// import { v4 as uuidv4 } from 'uuid';

const allStudent = async (req, res) => {
  try {
    const response = await Student.find({ deleted: "false" })
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
  const query = { studentuid: req.params.id, deleted: "false" }
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
    const response = await Student.findOneAndUpdate({ studentuid }, data, { new: true })
    console.log(data);
    if (!response) {
      return res.status(400).json({ "message": "Student not found" })
    }
    res.json(response).status(200)
  } catch (error) {
    res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
    console.log(response);
  }
}

const deleteStudent = async (req, res) => {
  const studentuid = req.params.id
  const changeFlag = { deleteflag: "true" }

  try {
    const response = await Student.findOneAndUpdate({ studentuid, deleteflag: false }, changeFlag)
    if (!response) {
      return res.status(400).json({ "message": "Student not found" })
    }
    res.status(200).json({ "message": "Student deleted successfuly" })
  } catch (error) {
    res.status(500).json({ "message": "Something went wrong", "errorMessage": error })
  }
}

const pendingReview = async (req, res) => {
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
        _id: 1,
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

const pendingStudentProfile = async (req, res) => {
  const { id } = req.params
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

const importRawtoStudent = async (req, res) => {
  const data = await RawData.find({ isImported: false })

  console.log(data);
  res.json(data)
}

const studentWithApprovalStatus = async (req, res) => {
  const approvaltype = req.params.id
  const data = await Student.find({ deleted: "false", approval: approvaltype })
  res.json(data)
}

const studentWithFormType = async (req, res) => {
  const formtype = req.params.id
  const data = await Student.find({ deleted: "false", formtype: formtype })

  res.json(data)

}
const studentWithApprovalStatusAndFormType = async (req, res) => {
  const approvalid = req.params.approvalid
  const formid = req.params.formid
  console.log(approvalid, formid);
  const data = await Student.find({ deleted: "false", formtype: formid, approval: approvalid })
  res.json(data)

}

// const manuallyApproveStudentData = async (req, res) => {
//   const studentuid = req.params.id
//   const data = {
//     manualapproval: true,
//     approval: "true"
//   }

//   await Student.findOneAndUpdate({ deleted: "false", studentuid}, data )
//   res.json({message: "request placed"})
// }

export { insertStudent, allStudent, singleStudent, updateStudent, deleteStudent, pendingReview, pendingStudentProfile, importRawtoStudent, studentWithApprovalStatus, studentWithFormType, studentWithApprovalStatusAndFormType,
 }