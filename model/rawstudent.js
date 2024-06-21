import mongoose from 'mongoose';

const { Schema } = mongoose;

const RawStudentSchema = new Schema({
  studentuid: { type: String, required: true },
  studenttype: { type: String },
  formtype: { type: String },
  category: { type: String },
  schoolcode: { type: String },
  schoolname: { type: String },
  name: { type: String },
  namehindi: { type: String },
  father: { type: String },
  fatherhindi: { type: String },
  mother: { type: String },
  motherhindi: { type: String },
  dob: { type: Date },
  gender: { type: String },
  caste: { type: String },
  nationality: { type: String },
  disability: { type: String },
  religion: { type: String },
  area: { type: String },
  maritalstatus: { type: String },
  phone: { type: String },
  adhaar: { type: String },
  adhaarstatus: { type: String },
  email: { type: String },
  address: { type: String },
  pincode: { type: String },
  bankaccount: { type: String },
  ifsc: { type: String },
  bankname: { type: String },
  identitymark1: { type: String },
  identitymark2: { type: String },
  mil: { type: String },
  sil: { type: String },
  visualimpared: { type: String },
  optional: { type: String },
  vocational: { type: String },
  approval: { type: String },
  correction: {type: [String]},
  isImported: {type: String, default: false},
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

const RawData = mongoose.model('RawData', RawStudentSchema);

export default RawData;
