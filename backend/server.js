import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import userCtrl from './app/controller/userController.js';
import eventCtrl from './app/controller/eventController.js';
import availabilityCtrl from './app/controller/availabilityController.js';
import publicCtrl from './app/controller/publicController.js';
import bookingCtrl from './app/controller/bookingController.js';
import notificationCtrl from './app/controller/notificationController.js';
import { AuthenticateUser } from './app/middleware/authMiddleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/users/register', userCtrl.registerUser);
app.post('/api/users/login', userCtrl.loginUser);
app.post('/api/users/google-login', userCtrl.googleLogin);
app.patch('/api/users/complete-profile', userCtrl.updateProfile);
app.put('/api/users/profile', AuthenticateUser, userCtrl.updateProfile);
app.patch('/api/users/password', AuthenticateUser, userCtrl.updatePassword);

app.get('/api/events', AuthenticateUser, eventCtrl.getEvents);
app.post('/api/events', AuthenticateUser, eventCtrl.createEvent);
app.put('/api/events/:id', AuthenticateUser, eventCtrl.updateEvent);
app.delete('/api/events/:id', AuthenticateUser, eventCtrl.deleteEvent);

app.get('/api/availability', AuthenticateUser, availabilityCtrl.getAvailability);
app.post('/api/availability', AuthenticateUser, availabilityCtrl.setAvailability);

app.get('/api/bookings', AuthenticateUser, bookingCtrl.getBookings);
app.get('/api/bookings/stats', AuthenticateUser, bookingCtrl.getStats);
app.patch('/api/bookings/:id/status', AuthenticateUser, bookingCtrl.updateStatus);

app.get('/api/notifications', AuthenticateUser, notificationCtrl.getNotifications);
app.post('/api/notifications/read-all', AuthenticateUser, notificationCtrl.ReadAll);
app.patch('/api/notifications/:id/read', AuthenticateUser, notificationCtrl.markAsRead);

app.get('/api/public/event/:username/:slug', publicCtrl.getPublicEvent);
app.post('/api/public/book', publicCtrl.createPublicBooking);


const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
