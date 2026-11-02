import { CAMPUSES, Patient } from '../models/patientModel.js';
import { QueueEntry } from '../models/queueEntryModel.js';
import { Counter } from '../models/counterModel.js';
import { User } from '../models/userModel.js';
import mongoose from 'mongoose';

const ACTIVE_QUEUE_STATES = ['waiting', 'triage', 'in_consultation'];

function clinicDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Addis_Ababa', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

export async function getPatients(request, response, next) {
  try {
    const search = typeof request.query.search === 'string' ? request.query.search.trim().slice(0, 100) : '';
    const filter = search ? {
      $or: [
        { fullName: { $regex: escapeRegex(search), $options: 'i' } },
        { universityId: { $regex: escapeRegex(search), $options: 'i' } },
      ],
    } : {};
    const patients = await Patient.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return response.json(patients);
  } catch (error) {
    return next(error);
  }
}

export async function getPatientQueue(request, response, next) {
  try {
    const filter = { status: { $in: ACTIVE_QUEUE_STATES } };
    if (CAMPUSES.includes(request.query.campus)) filter.campus = request.query.campus;
    const entries = await QueueEntry.find(filter)
      .populate('patient', 'universityId fullName age sex phone affiliation')
      .populate('assignedDoctor', 'name')
      .sort({ createdAt: 1 })
      .limit(250)
      .lean();
    const priority = { emergency: 0, urgent: 1, routine: 2 };
    entries.sort((left, right) => priority[left.priority] - priority[right.priority] || left.sequence - right.sequence);
    return response.json(entries);
  } catch (error) {
    return next(error);
  }
}

export async function postPatient(request, response, next) {
  try {
    const { age, sex, phone, campus, affiliation } = request.body;
    const fullName = typeof request.body.fullName === 'string' ? request.body.fullName.trim() : '';
    const universityId = typeof request.body.universityId === 'string' ? request.body.universityId.trim().toUpperCase() : '';
    const safePhone = typeof phone === 'string' ? phone.trim() : '';
    const numericAge = Number(age);
    if (!fullName || fullName.length > 120 || (affiliation !== 'visitor' && !universityId)
        || universityId.length > 80 || !Number.isInteger(numericAge) || numericAge < 0 || numericAge > 120
        || !['Female', 'Male', 'Other'].includes(sex) || !safePhone || safePhone.length > 40
        || !CAMPUSES.includes(campus) || !['student', 'staff', 'visitor'].includes(affiliation)) {
      return response.status(400).json({ error: 'Provide valid patient identity, campus, affiliation, age, sex, and phone details.' });
    }

    const dateKey = clinicDateKey();
    const counterId = `${campus}:${dateKey}`;
    const campusPrefix = { 'Main Campus': 'M', 'Tulu Awulya': 'T', Ginba: 'G' }[campus];
    const session = await mongoose.startSession();
    let patient;
    let queueEntry;
    try {
      await session.withTransaction(async () => {
        [patient] = await Patient.create([{
          universityId: universityId || undefined,
          fullName,
          age: numericAge,
          sex,
          phone: safePhone,
          email: request.body.email,
          campus,
          affiliation,
        }], { session });
        const counter = await Counter.findOneAndUpdate(
          { _id: counterId },
          { $inc: { sequence: 1 } },
          { new: true, upsert: true, setDefaultsOnInsert: true, session },
        );
        const campusQueueNumber = `${campusPrefix}-${String(counter.sequence).padStart(3, '0')}`;
        [queueEntry] = await QueueEntry.create([{
          patient: patient._id,
          campus,
          dateKey,
          sequence: counter.sequence,
          queueNumber: campusQueueNumber,
          createdBy: request.user.id,
        }], { session });
      });
    } finally {
      await session.endSession();
    }
    return response.status(201).json({ patient, queue: queueEntry });
  } catch (error) {
    return next(error);
  }
}

export async function updateTriage(request, response, next) {
  const { id } = request.params;
  const { priority, assignedDoctor, vitals = {} } = request.body;
  const bloodPressure = typeof vitals.bloodPressure === 'string' ? vitals.bloodPressure.trim() : '';
  const numericVitals = {
    temperatureC: Number(vitals.temperatureC),
    pulseRate: Number(vitals.pulseRate),
    spo2: Number(vitals.spo2),
    weightKg: Number(vitals.weightKg),
    heightCm: Number(vitals.heightCm),
  };
  const ranges = {
    temperatureC: [25, 45], pulseRate: [20, 250], spo2: [0, 100], weightKg: [0.1, 500], heightCm: [20, 280],
  };
  const invalidVital = Object.entries(ranges).some(([field, [minimum, maximum]]) => (
    !Number.isFinite(numericVitals[field]) || numericVitals[field] < minimum || numericVitals[field] > maximum
  ));

  if (!mongoose.isValidObjectId(id) || !/^\d{2,3}\/\d{2,3}$/.test(bloodPressure)
      || invalidVital || !['routine', 'urgent', 'emergency'].includes(priority)
      || (assignedDoctor && !mongoose.isValidObjectId(assignedDoctor))) {
    return response.status(400).json({ error: 'Provide valid vitals, priority, queue entry, and optional doctor assignment.' });
  }

  try {
    if (assignedDoctor && !(await User.exists({ _id: assignedDoctor, role: 'doctor', isActive: true }))) {
      return response.status(400).json({ error: 'Assigned clinician must be an active doctor account.' });
    }
    const bmi = Number((numericVitals.weightKg / ((numericVitals.heightCm / 100) ** 2)).toFixed(1));
    const entry = await QueueEntry.findOneAndUpdate(
      { _id: id, status: { $in: ['waiting', 'triage'] } },
      {
        $set: {
          status: 'triage', priority, assignedDoctor: assignedDoctor || undefined,
          triagedBy: request.user.id, triagedAt: new Date(), vitals: { ...numericVitals, bloodPressure, bmi },
        },
      },
      { new: true, runValidators: true },
    ).populate('patient', 'universityId fullName campus');
    if (!entry) return response.status(404).json({ error: 'Active queue entry not found.' });
    return response.json(entry);
  } catch (error) {
    return next(error);
  }
}
