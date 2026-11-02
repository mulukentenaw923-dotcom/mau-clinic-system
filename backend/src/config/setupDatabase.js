import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from './db.js';
import { ContactMessage } from '../models/contactMessageModel.js';
import { Inventory } from '../models/medicineModel.js';
import { MedicalRecord } from '../models/medicalRecordModel.js';
import { Patient } from '../models/patientModel.js';
import { QueueEntry } from '../models/queueEntryModel.js';
import { User } from '../models/userModel.js';
import { Counter } from '../models/counterModel.js';

try {
  await connectDatabase();
  await Promise.all([User, Patient, MedicalRecord, Inventory, QueueEntry, Counter, ContactMessage].map((model) => model.createIndexes()));
  console.log('MongoDB indexes are ready.');

  if (!(await User.exists({ role: 'super_admin' }))) {
    const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;
    if (!SUPER_ADMIN_NAME || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD || SUPER_ADMIN_PASSWORD.length < 12 || SUPER_ADMIN_PASSWORD.length > 72) {
      console.warn('No super admin exists. Set SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, and a 12–72 character SUPER_ADMIN_PASSWORD, then run db:setup.');
    } else {
      const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);
      await User.create({
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        passwordHash,
        role: 'super_admin',
      });
      console.log('Initial super-admin account created. Remove bootstrap credentials from the environment after setup.');
    }
  }
} catch (error) {
  console.error('Could not set up MongoDB indexes.', error);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
