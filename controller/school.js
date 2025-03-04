import SchoolProfile from "../model/school.js";
import { v4 as uuidv4 } from "uuid";
import { Student } from "../model/student.js";
import RawData from "../model/rawstudent.js";
import { barcodeGenrator } from "../service/library.js";

const allSchoolList = async (req, res) => {
  try {
    const response = await SchoolProfile.find({ deleted: false });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const singleSchool = async (req, res) => {
  const query = { schoolcode: req.params.id, deleted: false };
  try {
    const response = await SchoolProfile.findOne(query);
    if (!response) {
      return res
        .status(404)
        .json({ message: "School not found", statuscode: "404" });
    }
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", errorMessage: error });
  }
};

const insertSchool = async (req, res) => {
  let data = req.body;
  const uniqueId = uuidv4();
  data = { ...data, schooluid: uniqueId };
  barcodeGenrator(`${data.schoolcode}1`);
  barcodeGenrator(`${data.schoolcode}2`);
  barcodeGenrator(`${data.schoolcode}3`);
  barcodeGenrator(`${data.schoolcode}4`);
  try {
    const school = new SchoolProfile(data);
    await school.save();
    res.status(200).json(school);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", errorMessage: error });
  }
};

const updateSchool = async (req, res) => {
  const schoolcode = req.params.id;
  const data = req.body;
  try {
    const response = await SchoolProfile.findOneAndUpdate(
      { schoolcode, deleted: false },
      data,
      { new: true }
    );
    if (!response) {
      return res.status(400).json({ message: "School not found" });
    }
    res.json(response).status(200);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", errorMessage: error });
  }
};

const deleteSchool = async (req, res) => {
  const schoolcode = req.params.id;
  const changeFlag = { deleteflag: "true" };

  try {
    const response = await SchoolProfile.findOneAndUpdate(
      { schoolcode, deleted: false },
      changeFlag
    );
    if (!response) {
      return res.status(400).json({ message: "School not found" });
    }
    res.status(200).json({ message: "School deleted successfuly" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", errorMessage: error });
  }
};

const schoolWithStudentTotalData = async (req, res) => {
  const response = await SchoolProfile.aggregate([
    {
      $lookup: {
        from: "students", // The collection to join (note: it should be the collection name in MongoDB, not the model name)
        localField: "schoolcode", // Field from the school collection
        foreignField: "schoolcode", // Field from the student collection
        as: "students", // The name of the array field to add to each output document
      },
    },
    {
      $project: {
        schoolData: "$$ROOT", // Include all fields from the school collection
        studentCount: { $size: "$students" }, // Add a field for the number of students
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$schoolData", { studentCount: "$studentCount" }],
        },
      },
    },
  ])
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

const schoolWithStudentCount = async (req, res) => {
  const counts = await Student.aggregate([
    {
      $lookup: {
        from: "schools",
        localField: "schoolcode",
        foreignField: "schoolcode",
        as: "school",
      },
    },
    { $unwind: "$school" },
    {
      $group: {
        _id: {
          schoolId: "$school._id",
          schoolcode: "$school.schoolcode",
          schoolname: "$school.schoolname",
          mobile: "$school.mobile",
          village: "$school.village",
        },
        totalStudents: { $sum: 1 },
        approvalCounts: {
          $push: {
            approval: "$approval",
            count: { $sum: 1 },
          },
        },
      },
    },
    // Project to reshape the output
    {
      $project: {
        _id: "$_id.schoolId",
        schoolcode: "$_id.schoolcode",
        schoolname: "$_id.schoolname",
        totalStudents: "$totalStudents",
        mobile: "$_id.mobile",
        village: "$_id.village",
        approvalCounts: {
          $arrayToObject: {
            $map: {
              input: "$approvalCounts",
              as: "item",
              in: { k: "$$item.approval", v: "$$item.count" },
            },
          },
        },
      },
    },
  ]);
  res.json(counts);
};

const schoolWithRawStudentCountImportTrue = async (req, res) => {
  await SchoolProfile.aggregate([
    {
      $lookup: {
        from: "rawdatas", // The collection to join
        localField: "schoolcode", // Field from the school collection
        foreignField: "schoolcode", // Field from the student collection
        as: "students", // The name of the array field to add to each output document
      },
    },
    {
      $addFields: {
        studentCount: {
          $size: {
            $filter: {
              input: "$students",
              as: "student",
              cond: { $eq: ["$$student.isImported", "true"] }, // Filter students where isImported is false
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
};

const schoolWithRawStudentCountImportFalse = async (req, res) => {
  await SchoolProfile.aggregate([
    {
      $lookup: {
        from: "rawdatas", // The collection to join
        localField: "schoolcode", // Field from the school collection
        foreignField: "schoolcode", // Field from the student collection
        as: "students", // The name of the array field to add to each output document
      },
    },
    {
      $addFields: {
        studentCount: {
          $size: {
            $filter: {
              input: "$students",
              as: "student",
              cond: { $eq: ["$$student.isImported", "false"] }, // Filter students where isImported is false
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
};

const studentWithRawDataImportedTrue = async (req, res) => {
  const { id } = req.params;
  await RawData.find({ schoolcode: id, isImported: "true" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

const studentWithRawDataImportedFalse = async (req, res) => {
  const { id } = req.params;
  await RawData.find({ schoolcode: id, isImported: "false" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

const studentPendingDataList = async (req, res) => {
  const { id } = req.params;
  await Student.find({ schoolcode: id, approval: "false", deleted: "false" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

const singleSchoolStudentLists = async (req, res) => {
  const { id } = req.params;
  await Student.find({ schoolcode: id, deleted: "false" })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

const generateBarcode = (req, res) => {
  const { id } = req.params;
  const response = barcodeGenrator(id);
  console.log(response);
  res.json(response);
};

const importRawDatatoStudentTable = async (req, res) => {
  const response = await RawData.find({
    isImported: "false",
    deleted: "false",
  });

  await RawData.updateMany(
    { isImported: "false", deleted: "false" },
    { $set: { isImported: "true" } }
  );

  function convertToSimpleArray(array) {
    // Initialize an empty array to store the transformed objects
    const newArray = [];

    // Iterate over each object in the input array
    array.forEach((mongooseObj) => {
      // Extract the plain JavaScript object without Mongoose internals
      const plainObj = mongooseObj.toObject({ virtuals: true });

      // Destructure _id from the object and exclude it from the new object
      const { _id, ...newObj } = plainObj;

      // Push the modified object (without _id) into the new array
      newArray.push(newObj);
    });

    return newArray;
  }

  const modifieddata = convertToSimpleArray(response);
  await Student.insertMany(modifieddata);
  res.json(modifieddata);
  // res.json({message: "imported"})
};

export {
  allSchoolList,
  insertSchool,
  updateSchool,
  singleSchool,
  deleteSchool,
  schoolWithStudentTotalData,
  schoolWithStudentCount,
  schoolWithRawStudentCountImportFalse,
  schoolWithRawStudentCountImportTrue,
  studentWithRawDataImportedTrue,
  studentWithRawDataImportedFalse,
  studentPendingDataList,
  singleSchoolStudentLists,
  generateBarcode,
  importRawDatatoStudentTable,
};
