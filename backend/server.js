
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const { User, Team, PresencePlan, Settings, Notification } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clockin')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user.roles.includes(role) && !req.user.roles.includes('Admin')) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// --- Initialization Helper ---
const initializeSettings = async () => {
    const exists = await Settings.findOne({ type: 'GLOBAL' });
    if (!exists) {
        await Settings.create({
            type: 'GLOBAL',
            workPolicy: { minOfficeDays: 2, maxHomeDays: 3 },
            mandatoryDates: [],
            statusOptions: [
                { id: 's1', value: 'Office', label: 'Office', labelHe: 'משרד', icon: 'office', color: 'bg-blue-500', isDefault: true },
                { id: 's2', value: 'Home', label: 'Home', labelHe: 'בית', icon: 'home', color: 'bg-green-500', isDefault: true },
                { id: 's3', value: 'Vacation', label: 'Vacation', labelHe: 'חופש', icon: 'sun', color: 'bg-yellow-500', isDefault: true },
                { id: 's4', value: 'Sick', label: 'Sick', labelHe: 'מחלה', icon: 'heart', color: 'bg-red-500', isDefault: true },
                { id: 's6', value: 'Other', label: 'Other', labelHe: 'אחר', icon: 'question', color: 'bg-gray-500', isDefault: true },
            ]
        });
        console.log('Global settings initialized');
    }
};
initializeSettings();

// --- Auth Routes ---

// Google Login / Verify
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const avatarUrl = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        id: googleId,
        name,
        email,
        avatarUrl,
        roles: ['Employee'] // Default role
      });
    }

    // Sign JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles, teamId: user.teamId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token: accessToken, user });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
});

// Get Current User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// --- User Management (Admin) ---
app.get('/api/users', authenticateToken, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.put('/api/users/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  const updatedUser = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(updatedUser);
});

app.post('/api/users', authenticateToken, requireRole('Admin'), async (req, res) => {
  // Manual creation (without Google)
  try {
      const newUser = await User.create({ ...req.body, id: `u${Date.now()}` });
      res.json(newUser);
  } catch(e) {
      res.status(400).json({ error: e.message });
  }
});

app.delete('/api/users/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'User deleted' });
});


// --- Team Management ---
app.get('/api/teams', authenticateToken, async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

app.post('/api/teams', authenticateToken, requireRole('Admin'), async (req, res) => {
  const newTeam = await Team.create({ ...req.body, id: `t${Date.now()}` });
  res.json(newTeam);
});

app.put('/api/teams/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
  const team = await Team.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(team);
});

app.delete('/api/teams/:id', authenticateToken, requireRole('Admin'), async (req, res) => {
    await Team.findOneAndDelete({ id: req.params.id });
    // Cleanup users
    await User.updateMany({ teamId: req.params.id }, { $set: { teamId: null } });
    res.json({ message: 'Team deleted' });
});


// --- Plans ---

// Get plans for a specific week
app.get('/api/plans', authenticateToken, async (req, res) => {
  const { weekOf, userId, teamId } = req.query;
  const query = {};
  if (weekOf) query.weekOf = weekOf;
  
  // Filtering logic based on roles
  if (req.user.roles.includes('Admin') || req.user.roles.includes('HR')) {
      // Can see all, optional filtering
      if (userId) query.userId = userId;
  } else if (req.user.roles.includes('Team Lead')) {
      // Can see own team
      const myTeamId = req.user.teamId;
      // Fetch users in my team to get their IDs
      const teamUsers = await User.find({ teamId: myTeamId });
      const teamUserIds = teamUsers.map(u => u.id);
      
      if (userId) {
           if (!teamUserIds.includes(userId)) return res.status(403).json({ message: "Not in your team" });
           query.userId = userId;
      } else {
           query.userId = { $in: teamUserIds };
      }
  } else {
      // Employee - only see own
      query.userId = req.user.id;
  }

  const plans = await PresencePlan.find(query);
  
  // We need to hydrate user info for the frontend
  const populatedPlans = await Promise.all(plans.map(async (p) => {
      const user = await User.findOne({ id: p.userId });
      return { ...p.toObject(), user };
  }));

  res.json(populatedPlans);
});

// Create/Update Plan
app.post('/api/plans', authenticateToken, async (req, res) => {
  const { weekOf, plan, violationReason, status } = req.body;
  
  // Upsert plan
  const updatedPlan = await PresencePlan.findOneAndUpdate(
    { userId: req.user.id, weekOf },
    { 
        userId: req.user.id,
        weekOf,
        plan,
        violationReason,
        status: status || 'Pending',
        submittedAt: new Date()
    },
    { new: true, upsert: true }
  );
  
  // Hydrate user
  const user = await User.findOne({ id: req.user.id });

  // NOTIFICATION LOGIC: Notify Team Lead
  if (user.teamId) {
      const team = await Team.findOne({ id: user.teamId });
      if (team && team.leaderId && team.leaderId !== req.user.id) {
          await Notification.create({
              recipientId: team.leaderId,
              message: `${user.name} submitted a plan for week ${weekOf}`,
              type: 'info',
              date: new Date().toISOString(),
              relatedLink: '/team-view' 
          });
      }
  }
  
  res.json({ ...updatedPlan.toObject(), user });
});

// Status Update (Approve/Reject)
app.put('/api/plans/:id/status', authenticateToken, async (req, res) => {
    const { status } = req.body;
    // Add logic here to verify if requester is Team Lead of the plan owner
    const plan = await PresencePlan.findById(req.params.id);
    if (!plan) return res.status(404).json({message: 'Plan not found'});
    
    plan.status = status;
    await plan.save();

    // NOTIFICATION LOGIC: Notify Plan Owner
    await Notification.create({
        recipientId: plan.userId,
        message: `Your presence plan for week ${plan.weekOf} was ${status}`,
        type: status === 'Approved' ? 'success' : 'warning',
        date: new Date().toISOString(),
        relatedLink: '/dashboard'
    });

    res.json(plan);
});

// --- Notifications ---
app.get('/api/notifications', authenticateToken, async (req, res) => {
    const notifications = await Notification.find({ recipientId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
});

// --- Settings ---
app.get('/api/settings', authenticateToken, async (req, res) => {
    const settings = await Settings.findOne({ type: 'GLOBAL' });
    res.json(settings);
});

app.put('/api/settings', authenticateToken, requireRole('Admin'), async (req, res) => {
    const settings = await Settings.findOneAndUpdate({ type: 'GLOBAL' }, req.body, { new: true });
    res.json(settings);
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
