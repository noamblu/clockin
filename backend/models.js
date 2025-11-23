const mongoose = require('mongoose');

// --- User Schema ---
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Google Sub ID or Generated
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  roles: { type: [String], default: ['Employee'] }, // ['Employee', 'Team Lead', 'HR', 'Admin']
  teamId: { type: String, default: null },
  phoneNumber: String
}, { timestamps: true });

// --- Team Schema ---
const teamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  leaderId: { type: String, default: null }
}, { timestamps: true });

// --- Presence Plan Schema ---
const dailyPlanSchema = new mongoose.Schema({
  day: String, // Sunday, Monday...
  date: String, // YYYY-MM-DD
  status: String, // Office, Home, etc.
  note: String
});

const presencePlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  weekOf: { type: String, required: true }, // Date string of the Sunday
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Not Submitted'],
    default: 'Not Submitted'
  },
  plan: [dailyPlanSchema],
  submittedAt: Date,
  violationReason: String
}, { timestamps: true });

// Ensure one plan per user per week
presencePlanSchema.index({ userId: 1, weekOf: 1 }, { unique: true });

// --- System Settings Schema (Mandatory Dates, Policies, Statuses) ---
const mandatoryDateSchema = new mongoose.Schema({
  id: String,
  date: String,
  status: String,
  description: String,
  teamIds: [String] // Empty = All teams
});

const statusOptionSchema = new mongoose.Schema({
  id: String,
  value: String,
  label: String,
  labelHe: String,
  icon: String,
  color: String,
  isDefault: Boolean
});

const settingsSchema = new mongoose.Schema({
  type: { type: String, default: 'GLOBAL' }, // Singleton document
  workPolicy: {
    minOfficeDays: { type: Number, default: 0 },
    maxHomeDays: { type: Number, default: 5 }
  },
  mandatoryDates: [mandatoryDateSchema],
  statusOptions: [statusOptionSchema]
});

const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);
const PresencePlan = mongoose.model('PresencePlan', presencePlanSchema);
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = { User, Team, PresencePlan, Settings };
