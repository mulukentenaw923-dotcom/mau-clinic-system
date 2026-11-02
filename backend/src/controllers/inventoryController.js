import mongoose from 'mongoose';
import { Inventory } from '../models/medicineModel.js';

export async function getInventory(request, response, next) {
  try {
    const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : '';
    const filter = search ? { $or: [
      { name: { $regex: search.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), $options: 'i' } },
      { category: { $regex: search.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), $options: 'i' } },
    ] } : {};
    return response.json(await Inventory.find(filter).sort({ name: 1, expiresOn: 1 }).limit(200).lean());
  } catch (error) {
    return next(error);
  }
}

export async function postMedicine(request, response, next) {
  try {
    const { name, category, batchNumber, unit, expiresOn } = request.body;
    const quantity = Number(request.body.quantity);
    const reorderLevel = Number(request.body.reorderLevel);
    const safeName = typeof name === 'string' ? name.trim() : '';
    const safeCategory = typeof category === 'string' ? category.trim() : '';
    if (!safeName || safeName.length > 160 || !safeCategory || safeCategory.length > 100
        || typeof batchNumber !== 'string' || !batchNumber.trim() || batchNumber.length > 80
        || typeof unit !== 'string' || !unit.trim() || unit.length > 32
        || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(reorderLevel) || reorderLevel < 0
        || (expiresOn && !/^\d{4}-\d{2}-\d{2}$/.test(expiresOn))) {
      return response.status(400).json({ error: 'Provide valid medicine details, stock, reorder level, and expiry date.' });
    }
    const inventoryItem = await Inventory.create({
      name: safeName,
      category: safeCategory,
      batchNumber: batchNumber.trim(),
      unit: unit.trim(),
      quantity,
      reorderLevel,
      expiresOn,
      createdBy: request.user.id,
    });
    return response.status(201).json(inventoryItem);
  } catch (error) {
    return next(error);
  }
}

export async function patchMedicine(request, response, next) {
  try {
    const quantity = Number(request.body.quantity);
    if (!mongoose.isValidObjectId(request.params.id) || !Number.isInteger(quantity) || quantity < 0) {
      return response.status(400).json({ error: 'Provide a valid medicine ID and non-negative stock quantity.' });
    }
    const medicine = await Inventory.findByIdAndUpdate(request.params.id, { $set: { quantity } }, { new: true, runValidators: true });
    if (!medicine) return response.status(404).json({ error: 'Medicine not found.' });
    return response.json(medicine);
  } catch (error) {
    return next(error);
  }
}

export async function removeMedicine(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) return response.status(400).json({ error: 'Invalid medicine ID.' });
    if (!(await Inventory.findByIdAndDelete(request.params.id))) return response.status(404).json({ error: 'Medicine not found.' });
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
}

export async function dispenseMedicine(request, response, next) {
  try {
    const quantity = Number(request.body.quantity);
    if (!mongoose.isValidObjectId(request.params.id) || !Number.isInteger(quantity) || quantity < 1) {
      return response.status(400).json({ error: 'Provide a valid medicine ID and positive dispense quantity.' });
    }
    const medicine = await Inventory.findOneAndUpdate(
      { _id: request.params.id, quantity: { $gte: quantity }, expiresOn: { $gt: new Date() } },
      { $inc: { quantity: -quantity } },
      { new: true, runValidators: true },
    );
    if (!medicine) return response.status(409).json({ error: 'Medicine is unavailable, expired, or has insufficient stock.' });
    return response.json(medicine);
  } catch (error) {
    return next(error);
  }
}
