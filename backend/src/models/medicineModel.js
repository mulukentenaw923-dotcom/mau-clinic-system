import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: String, required: true, trim: true, maxlength: 100 },
  batchNumber: { type: String, required: true, trim: true, uppercase: true, maxlength: 80 },
  quantity: { type: Number, required: true, min: 0, validate: Number.isInteger },
  unit: { type: String, required: true, trim: true, maxlength: 32 },
  reorderLevel: { type: Number, required: true, min: 0, validate: Number.isInteger },
  expiresOn: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, versionKey: false });

inventorySchema.index({ name: 1, batchNumber: 1 }, { unique: true });
inventorySchema.index({ expiresOn: 1, quantity: 1 });

export const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
