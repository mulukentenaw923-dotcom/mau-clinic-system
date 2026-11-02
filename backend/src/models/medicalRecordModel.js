import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  medicineName: { type: String, required: true, trim: true, maxlength: 160 },
  dosage: { type: String, required: true, trim: true, maxlength: 120 },
  instructions: { type: String, required: true, trim: true, maxlength: 500 },
  quantity: { type: Number, min: 1, validate: Number.isInteger },
  status: { type: String, enum: ['pending', 'partially_dispensed', 'dispensed'], default: 'pending' },
}, { _id: true });

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campus: { type: String, enum: ['Main Campus', 'Tulu Awulya', 'Ginba'], required: true },
  vitals: {
    bloodPressure: { type: String, trim: true, maxlength: 20 },
    temperatureC: { type: Number, min: 25, max: 45 },
    pulseRate: { type: Number, min: 20, max: 250 },
    spo2: { type: Number, min: 0, max: 100 },
    weightKg: { type: Number, min: 0, max: 500 },
    heightCm: { type: Number, min: 0, max: 280 },
  },
  diagnosis: { type: String, required: true, trim: true, maxlength: 1000 },
  notes: { type: String, trim: true, maxlength: 10000 },
  prescriptions: { type: [prescriptionSchema], default: [] },
  sickLeave: {
    startsOn: Date,
    endsOn: Date,
    reason: { type: String, trim: true, maxlength: 1000 },
    status: { type: String, enum: ['pending', 'approved', 'declined'] },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationCodeHash: { type: String, select: false },
  },
}, { timestamps: true, versionKey: false });

medicalRecordSchema.index({ patient: 1, createdAt: -1 });
medicalRecordSchema.index({ provider: 1, createdAt: -1 });

export const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', medicalRecordSchema);