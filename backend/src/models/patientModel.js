import mongoose from 'mongoose';

export const CAMPUSES = ['Main Campus', 'Tulu Awulya', 'Ginba'];

const patientSchema = new mongoose.Schema({
  universityId: { type: String, trim: true, uppercase: true, maxlength: 80 },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  age: { type: Number, min: 0, max: 120, required: true },
  sex: { type: String, enum: ['Female', 'Male', 'Other'], required: true },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  email: { type: String, trim: true, lowercase: true, maxlength: 254 },
  affiliation: { type: String, enum: ['student', 'staff', 'visitor'], required: true },
  campus: { type: String, enum: CAMPUSES, required: true },
}, { timestamps: true, versionKey: false });

patientSchema.path('universityId').required(function universityIdRequired() {
  return this.affiliation !== 'visitor';
});
patientSchema.index({ universityId: 1 }, { unique: true, sparse: true });
patientSchema.index({ fullName: 'text', universityId: 'text' });

export const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
