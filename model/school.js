import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    schooluid: { type: String, required: true },
    schoolcode: { type: String, required: true },
    schoolname: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    pincode: { type: String, required: true },
    principal: { type: String, required: true },
    mobile: { type: String, required: true },
    mobile2: { type: String, required: true },
    email: { type: String, required: true },
    deleted: { type: String, required: true },
}, { timestamps: true });

const SchoolProfile = mongoose.model('School', schoolSchema);

export default SchoolProfile;
