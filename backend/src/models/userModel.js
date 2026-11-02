import mongoose from 'mongoose';

export const USER_ROLES = ['super_admin', 'receptionist', 'triage_nurse', 'doctor', 'pharmacist'];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: USER_ROLES, required: true, default: 'receptionist' },
  staffId: { type: String, trim: true, maxlength: 80 },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { transform(_document, value) { delete value.passwordHash; return value; } },
});

userSchema.index({ role: 1, isActive: 1 });

export const User = mongoose.models.User || mongoose.model('User', userSchema);

export function findUserByEmail(email) {
  return User.findOne({ email }).select('+passwordHash').lean();
}

export async function createUser({ name, email, passwordHash, role = 'receptionist', staffId }) {
  const user = await User.create({ name, email, passwordHash, role, staffId });
  return user.toJSON();
}
