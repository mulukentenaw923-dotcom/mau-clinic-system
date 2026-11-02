import { createHash } from 'node:crypto';
import PDFDocument from 'pdfkit';
import { ContactMessage } from '../models/contactMessageModel.js';
import { MedicalRecord } from '../models/medicalRecordModel.js';
import { CAMPUSES, Patient } from '../models/patientModel.js';
import { QueueEntry } from '../models/queueEntryModel.js';
import { Inventory } from '../models/medicineModel.js';
import { User } from '../models/userModel.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACTIVE_QUEUE_STATES = ['waiting', 'triage', 'in_consultation'];

function readText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function createContactMessage(request, response, next) {
  const fullName = readText(request.body.fullName, 120);
  const universityId = readText(request.body.universityId, 80) || null;
  const email = readText(request.body.email, 254).toLowerCase();
  const campus = readText(request.body.campus, 40);
  const subject = readText(request.body.subject, 160);
  const message = readText(request.body.message, 3000);

  if (
    !fullName ||
    !EMAIL_PATTERN.test(email) ||
    !CAMPUSES.includes(campus) ||
    !subject ||
    !message ||
    message.length < 10
  ) {
    return response.status(400).json({ error: 'Provide a valid name, email, campus, subject, and message of at least 10 characters.' });
  }

  try {
    const savedMessage = await ContactMessage.create({ fullName, universityId, email, campus, subject, message });
    return response.status(201).json({ messageId: savedMessage.id, receivedAt: savedMessage.createdAt });
  } catch (error) {
    return next(error);
  }
}

function clinicDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Addis_Ababa', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export async function getPublicQueue(request, response, next) {
  const universityId = readText(request.query.universityId, 80).toUpperCase();
  const campus = readText(request.query.campus, 40);
  if (!universityId || !CAMPUSES.includes(campus)) {
    return response.status(400).json({ error: 'Provide your MAU ID and campus.' });
  }

  try {
    const patient = await Patient.findOne({ universityId, campus }).select('_id').lean();
    if (!patient) return response.status(404).json({ error: 'No active queue entry was found.' });
    const dateKey = clinicDateKey();
    const queueEntry = await QueueEntry.findOne({ patient: patient._id, campus, dateKey })
      .sort({ createdAt: -1 })
      .lean();
    if (!queueEntry) return response.status(404).json({ error: 'No active queue entry was found.' });

    const priorityRanks = { emergency: 0, urgent: 1, routine: 2 };
    const priorEntries = await QueueEntry.find({
      campus,
      dateKey,
      status: { $in: ACTIVE_QUEUE_STATES },
      $or: [
        { priority: { $in: Object.keys(priorityRanks).filter((priority) => priorityRanks[priority] < priorityRanks[queueEntry.priority]) } },
        { priority: queueEntry.priority, sequence: { $lt: queueEntry.sequence } },
      ],
    }).select('_id').lean();

    return response.json({
      campus,
      queueNumber: queueEntry.queueNumber,
      status: queueEntry.status,
      position: queueEntry.status === 'completed' ? null : priorEntries.length + 1,
      updatedAt: queueEntry.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
}

export async function downloadCertificate(request, response, next) {
  const universityId = readText(request.body.universityId, 80).toUpperCase();
  const verificationCode = readText(request.body.verificationCode, 100);
  if (!universityId || verificationCode.length < 24) {
    return response.status(400).json({ error: 'Provide a valid MAU ID and certificate verification code.' });
  }

  try {
    const patient = await Patient.findOne({ universityId }).select('_id fullName universityId').lean();
    if (!patient) return response.status(404).json({ error: 'Approved certificate not found.' });
    const verificationCodeHash = createHash('sha256').update(verificationCode).digest('hex');
    const record = await MedicalRecord.findOne({
      patient: patient._id,
      'sickLeave.status': 'approved',
      'sickLeave.verificationCodeHash': verificationCodeHash,
    }).lean();
    if (!record) return response.status(404).json({ error: 'Approved certificate not found.' });

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="MAU-medical-certificate-${record._id}.pdf"`);
    const document = new PDFDocument({ size: 'A4', margin: 60, info: { Title: 'MAU Clinic Medical Certificate' } });
    document.pipe(response);
    document.fontSize(17).text('MEKDELA AMBA UNIVERSITY CLINIC', { align: 'center' });
    document.moveDown(0.5).fontSize(13).text('MEDICAL CERTIFICATE', { align: 'center' });
    document.moveDown(2).fontSize(11);
    document.text(`This is to certify that ${patient.fullName} (MAU ID: ${patient.universityId}) was assessed by the university clinic.`);
    document.moveDown();
    document.text(`Medical leave: ${new Date(record.sickLeave.startsOn).toLocaleDateString()} to ${new Date(record.sickLeave.endsOn).toLocaleDateString()}.`);
    document.moveDown(2).text('This certificate was approved by an authorized clinic provider.');
    document.moveDown(3).text(`Verification reference: ${record._id}`);
    document.end();
  } catch (error) {
    return next(error);
  }
}

export async function getPublicSummary(_request, response, next) {
  try {
    const dateKey = clinicDateKey();
    const [dailyPatientsServed, activeDoctors, availableMedicines] = await Promise.all([
      QueueEntry.countDocuments({ dateKey, status: 'completed' }),
      User.countDocuments({ role: 'doctor', isActive: true }),
      Inventory.countDocuments({ quantity: { $gt: 0 }, expiresOn: { $gt: new Date() } }),
    ]);
    return response.json({ dailyPatientsServed, activeDoctors, availableMedicines, updatedAt: new Date() });
  } catch (error) {
    return next(error);
  }
}