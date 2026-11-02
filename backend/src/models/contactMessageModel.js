import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  universityId: { type: String, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  campus: { type: String, enum: ['Main Campus', 'Tulu Awulya', 'Ginba'], required: true },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ['new', 'reviewed', 'closed'], default: 'new' },
}, { timestamps: true, versionKey: false });

contactMessageSchema.index({ createdAt: -1, campus: 1 });

export const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);