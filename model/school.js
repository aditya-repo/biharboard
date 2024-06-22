import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    schooluid: { type: String, required: true },
    schoolcode: { type: String},
    schoolname: { type: String},
    district: { type: String},
    village: { type: String},
    pincode: { type: String},
    principal: { type: String},
    mobile: { type: String},
    mobile2: { type: String},
    email: { type: String},
    deleted: { type: String, required: true, default: "false" },
}, { timestamps: true });

const SchoolProfile = mongoose.model('School', schoolSchema);

export default SchoolProfile;
