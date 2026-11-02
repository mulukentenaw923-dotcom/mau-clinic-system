import assert from 'node:assert/strict';
import test from 'node:test';
import { Inventory } from '../src/models/medicineModel.js';
import { MedicalRecord } from '../src/models/medicalRecordModel.js';
import { Patient } from '../src/models/patientModel.js';
import { QueueEntry } from '../src/models/queueEntryModel.js';
import { User } from '../src/models/userModel.js';

test('user role is restricted and password hash is omitted from JSON', async () => {
  const user = new User({
    name: 'Clinic Admin',
    email: 'admin@example.edu',
    passwordHash: 'hashed-password',
    role: 'unsupported',
  });
  await assert.rejects(user.validate(), (error) => Boolean(error.errors.role));

  user.role = 'super_admin';
  await user.validate();
  assert.equal(user.toJSON().passwordHash, undefined);
});

test('students require a university ID while visitors may omit it', async () => {
  const patientFields = {
    fullName: 'Test Patient',
    age: 20,
    sex: 'Female',
    phone: '0911000000',
    campus: 'Main Campus',
    affiliation: 'student',
  };
  await assert.rejects(new Patient(patientFields).validate(), (error) => Boolean(error.errors.universityId));
  await new Patient({ ...patientFields, affiliation: 'visitor' }).validate();
});

test('inventory rejects negative stock', async () => {
  const inventory = new Inventory({
    name: 'Test medicine',
    category: 'General',
    batchNumber: 'BATCH-1',
    quantity: -1,
    unit: 'tablet',
    reorderLevel: 5,
    expiresOn: new Date('2027-01-01'),
    createdBy: '507f1f77bcf86cd799439011',
  });
  await assert.rejects(inventory.validate(), (error) => Boolean(error.errors.quantity));
});

test('queue priority and medical record diagnosis use controlled validation', async () => {
  const entry = new QueueEntry({
    patient: '507f1f77bcf86cd799439011',
    campus: 'Main Campus',
    dateKey: '2026-11-02',
    sequence: 1,
    queueNumber: 'M-001',
    priority: 'critical',
    createdBy: '507f1f77bcf86cd799439012',
  });
  await assert.rejects(entry.validate(), (error) => Boolean(error.errors.priority));

  const record = new MedicalRecord({
    patient: '507f1f77bcf86cd799439011',
    provider: '507f1f77bcf86cd799439012',
    campus: 'Main Campus',
  });
  await assert.rejects(record.validate(), (error) => Boolean(error.errors.diagnosis));
});