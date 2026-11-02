import { createHash, randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { MedicalRecord } from '../models/medicalRecordModel.js';
import { Patient } from '../models/patientModel.js';
import { QueueEntry } from '../models/queueEntryModel.js';

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export async function createConsultation(request, response, next) {
  const patientId = request.body.patientId;
  const diagnosis = typeof request.body.diagnosis === 'string' ? request.body.diagnosis.trim() : '';
  const notes = typeof request.body.notes === 'string' ? request.body.notes.trim() : '';
  const prescriptions = Array.isArray(request.body.prescriptions) ? request.body.prescriptions : [];
  if (!mongoose.isValidObjectId(patientId) || !diagnosis || diagnosis.length > 1000 || notes.length > 10000
      || prescriptions.length > 20) {
    return response.status(400).json({ error: 'Provide a valid patient and diagnosis.' });
  }

  try {
    const patient = await Patient.findById(patientId).lean();
    if (!patient) return response.status(404).json({ error: 'Patient not found.' });
    const record = await MedicalRecord.create({
      patient: patient._id,
      provider: request.user.id,
      campus: patient.campus,
      diagnosis,
      notes,
      vitals: request.body.vitals || {},
      prescriptions,
    });
    await QueueEntry.updateMany(
      { patient: patient._id, status: { $in: ['waiting', 'triage', 'in_consultation'] } },
      { $set: { status: 'completed' } },
    );
    return response.status(201).json(record);
  } catch (error) {
    return next(error);
  }
}

export async function createSickLeave(request, response, next) {
  try {
    const { patientId, startsOn, endsOn, diagnosis, reason } = request.body;
    const safeDiagnosis = typeof diagnosis === 'string' ? diagnosis.trim() : '';
    const safeReason = typeof reason === 'string' ? reason.trim() : '';
    if (!mongoose.isValidObjectId(patientId) || !validDate(startsOn)
        || !validDate(endsOn) || endsOn < startsOn || !safeDiagnosis || safeDiagnosis.length > 1000
        || !safeReason || safeReason.length > 2000) {
      return response.status(400).json({ error: 'Provide a patient, diagnosis, valid date range, and reason.' });
    }
    const patient = await Patient.findById(patientId).lean();
    if (!patient) return response.status(404).json({ error: 'Patient not found.' });

    const record = await MedicalRecord.create({
      patient: patient._id,
      provider: request.user.id,
      campus: patient.campus,
      diagnosis: safeDiagnosis,
      notes: safeReason,
      sickLeave: { startsOn, endsOn, reason: safeReason, status: 'pending' },
    });
    return response.status(201).json(record);
  } catch (error) {
    return next(error);
  }
}

export async function getSickLeaves(request, response, next) {
  try {
    const records = await MedicalRecord.find({ 'sickLeave.status': { $exists: true } })
      .populate('patient', 'universityId fullName campus')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return response.json(records);
  } catch (error) {
    return next(error);
  }
}

export async function reviewSickLeave(request, response, next) {
  try {
    const { id } = request.params;
    const { status } = request.body;
    if (!mongoose.isValidObjectId(id) || !['approved', 'declined'].includes(status)) {
      return response.status(400).json({ error: 'Provide a valid request ID and review decision.' });
    }
    const record = await MedicalRecord.findOne({ _id: id, 'sickLeave.status': 'pending' });
    if (!record) return response.status(404).json({ error: 'Pending sick leave request not found.' });
    record.sickLeave.status = status;
    record.sickLeave.approvedBy = request.user.id;
    let verificationCode;
    if (status === 'approved') {
      verificationCode = randomBytes(24).toString('base64url');
      record.sickLeave.verificationCodeHash = createHash('sha256').update(verificationCode).digest('hex');
    } else {
      record.sickLeave.verificationCodeHash = undefined;
    }
    await record.save();
    return response.json({ record, ...(verificationCode ? { verificationCode } : {}) });
  } catch (error) {
    return next(error);
  }
}
