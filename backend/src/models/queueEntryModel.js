import mongoose from 'mongoose';

const queueEntrySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  campus: { type: String, enum: ['Main Campus', 'Tulu Awulya', 'Ginba'], required: true },
  dateKey: { type: String, required: true },
  sequence: { type: Number, required: true, min: 1 },
  queueNumber: { type: String, required: true },
  priority: { type: String, enum: ['routine', 'urgent', 'emergency'], default: 'routine' },
  status: { type: String, enum: ['waiting', 'triage', 'in_consultation', 'completed', 'cancelled'], default: 'waiting' },
  vitals: {
    bloodPressure: { type: String, trim: true, maxlength: 20 },
    temperatureC: { type: Number, min: 25, max: 45 },
    pulseRate: { type: Number, min: 20, max: 250 },
    spo2: { type: Number, min: 0, max: 100 },
    weightKg: { type: Number, min: 0, max: 500 },
    heightCm: { type: Number, min: 0, max: 280 },
    bmi: { type: Number, min: 0, max: 100 },
  },
  triagedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  triagedAt: Date,
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, versionKey: false });

queueEntrySchema.index({ campus: 1, dateKey: 1, sequence: 1 }, { unique: true });
queueEntrySchema.index({ campus: 1, dateKey: 1, status: 1, priority: 1, sequence: 1 });
queueEntrySchema.index({ patient: 1, dateKey: 1, status: 1 });
queueEntrySchema.index({ patient: 1, campus: 1, dateKey: 1 }, { unique: true });

export const QueueEntry = mongoose.models.QueueEntry || mongoose.model('QueueEntry', queueEntrySchema);