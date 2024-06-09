import SchoolProfile from "../model/school.js";
import { v4 as uuidv4 } from 'uuid';
import { Student } from "../model/student.js";
import RawData from "../model/rawstudent.js";

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

const schoolWithStudentTotalData = async (req,res)=>{
    const response = await SchoolProfile.aggregate([
        {
          $lookup: {
            from: 'students', // The collection to join (note: it should be the collection name in MongoDB, not the model name)
            localField: 'schoolcode', // Field from the school collection
            foreignField: 'schoolcode', // Field from the student collection
            as: 'students', // The name of the array field to add to each output document
          },
        },
        {
          $project: {
            schoolData: "$$ROOT", // Include all fields from the school collection
            studentCount: { $size: '$students' }, // Add a field for the number of students
          },
        },
        {
          $replaceRoot: {
            newRoot: { $mergeObjects: ["$schoolData", { studentCount: "$studentCount" }] }
          }
        }
      ])
        .then((result) => {

        return res.json(result)
        })
        .catch((err) => {
          console.error(err);
        });
}

const schoolWithStudentCount = async (req,res)=>{
  await SchoolProfile.aggregate([
    {
      $lookup: {
        from: 'students', // The collection to join
        localField: 'schoolcode', // Field from the school collection
        foreignField: 'schoolcode', // Field from the student collection
        as: 'students', // The name of the array field to add to each output document
      },
    },
    {
      $addFields: {
        studentCount: { $size: '$students' }, // Add a field for the number of students
        autoCount: {
          $size: {
            $filter: {
              input: '$students',
              cond: { $eq: ['$$this.approval', 'auto'] },
            },
          },
        },
        arrovedCount: {
          $size: {
            $filter: {
              input: '$students',
              cond: { $eq: ['$$this.approval', 'true'] },
            },
          },
        },
        pendingCount: {
          $size: {
            $filter: {
              input: '$students',
              cond: { $eq: ['$$this.approval', 'false'] },
            },
          },
        },
      },
    },
    {
      $project: {
        students: 0, // Exclude the students array from the result
      },
    },
  ])
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
}
const schoolWithRawStudentCount = async (req,res)=>{
    await SchoolProfile.aggregate([
      {
        $lookup: {
          from: 'rawdatas', // The collection to join
          localField: 'schoolcode', // Field from the school collection
          foreignField: 'schoolcode', // Field from the student collection
          as: 'students', // The name of the array field to add to each output document
        },
      },
      {
        $addFields: {
          studentCount: { $size: '$students' }, // Add a field for the number of students
        },
      },
      {
        $project: {
          students: 0, // Exclude the students array from the result
        },
      },
    ])
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
      });
}

const studentWithRawData = async (req,res)=>{
  const {id} = req.params
  await RawData.find({schoolcode:id})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
}

const studentPendingDataList = async (req,res)=>{
  const {id} = req.params
  await RawData.find({schoolcode:id,approval: 'false', deleted: 'false'})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
}

const singleSchoolStudentLists = async (req, res)=>{
  const {id} = req.params
  await Student.find({schoolcode:id, deleted: 'false'})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
}

export {
  allSchoolList, 
  insertSchool, 
  updateSchool, 
  singleSchool, 
  deleteSchool, 
  schoolWithStudentTotalData, 
  schoolWithStudentCount,
  schoolWithRawStudentCount,
  studentWithRawData,
  studentPendingDataList,
  singleSchoolStudentLists
}