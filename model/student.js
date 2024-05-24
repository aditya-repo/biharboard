import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentuid: { type: String, required: true },
    category: { type: String, required: true },
    schoolname: { type: String, required: true },
    name: { type: String, required: true },
    father: { type: String, required: true },
    mother: { type: String, required: true },
    gender: { type: String, required: true},
    nationality: { type: String, required: true},
    dob: { type: Date, required: true },
    religion: { type: String, required: true },
    caste: { type: String, required: true },
    maritalstatus: { type: String, required: true},
    area: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true},
    disability: { type: String, required: true },
    adhaarno: { type: String, required: true},
    verification: { type: String, required: true},
    deleteflag: { type: String, required: true}
});

const Student = mongoose.model('Student', studentSchema);

export {Student};
