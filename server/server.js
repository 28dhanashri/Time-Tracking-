const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Activity = require('./models/Activity');

// Load environment variables
dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Auto-seed initial demo activities if database is empty
const autoSeed = async () => {
  try {
    const count = await Activity.countDocuments();
    if (count === 0) {
      console.log('[Seed] Database is empty. Seeding initial demo activities...');
      await Activity.insertMany([
        {
          name: 'React Development',
          category: 'Development',
          description: 'Building modern UI components with React & Vite',
          totalTime: 0
        },
        {
          name: 'Python Practice',
          category: 'Education',
          description: 'Solving data structures and algorithmic problems',
          totalTime: 0
        },
        {
          name: 'College Assignment',
          category: 'Education',
          description: '3rd Year AI & Web Application Documentation',
          totalTime: 0
        },
        {
          name: 'Morning Exercise',
          category: 'Exercise',
          description: 'Daily cardio and workout routine',
          totalTime: 0
        }
      ]);
      console.log('[Seed] Initial activities seeded successfully!');
    }
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
};

setTimeout(autoSeed, 1500);

// API Routes
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Time Tracking Tool Backend API is operational',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` TIME TRACKING TOOL SERVER RUNNING ON PORT ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` REST API URL: http://localhost:${PORT}/api`);
  console.log(`==================================================`);
});
