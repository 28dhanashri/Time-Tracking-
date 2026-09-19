# TIME TRACKING TOOL
> A full-stack, modern SaaS-style web application for recording, monitoring, and analyzing activity durations.

---

## Table of Contents
1. [Project Overview & Problem Statement](#project-overview--problem-statement)
2. [Assigned Feature Set](#assigned-feature-set)
3. [Features Implemented](#features-implemented)
4. [Technologies Used](#technologies-used)
5. [Project Directory Structure](#project-directory-structure)
6. [Step-by-Step Installation & Setup](#step-by-step-installation--setup)
7. [API Endpoints Documentation](#api-endpoints-documentation)
8. [AI Tools Used & Representative Prompts](#ai-tools-used--representative-prompts)
9. [Testing Strategy & Edge Case Verification](#testing-strategy--edge-case-verification)
10. [Application Screenshots](#application-screenshots)
11. [Future Enhancements](#future-enhancements)
12. [College Viva Q&A Guide](#college-viva-qa-guide)

---

## Project Overview & Problem Statement

Students, professionals, and developers often struggle to monitor how effectively they spend their daily time across multiple tasks. Traditional timers lack category-wise breakdown, persistence across page refreshes, and daily analytics.

The **Time Tracking Tool** is a functional full-stack web application designed to allow users to create activities, run timestamp-accurate timers, categorize sessions, calculate daily total tracked time, and analyze productivity using dynamic charts.

---

## Assigned Feature Set

This application fulfills all 5 mandatory core requirements specified in the project assignment:
1. **Add Activities**: Create and manage activities with categories and optional descriptions.
2. **Start and Stop Timer**: Real-time stopwatch using timestamp calculations (`currentTime - startTime`) with single-timer restriction.
3. **Category-wise Tracking**: Group tracked hours by category (Development, Education, Work, Personal, Meeting, Exercise, Other).
4. **Time Summary**: Live summary dashboard displaying today's total, total activities, completed sessions count, active running timer, and top category.
5. **Daily Total**: Automatic calculation of daily tracked time over recent days.

---

## Features Implemented

- **Activity Management (CRUD)**: Add, edit, and delete activities. Validate inputs and auto-update total time tracked.
- **Timestamp-Accurate Timer**: Calculates elapsed duration using system timestamps, preventing timer drift.
- **Single Active Timer Rule**: Only one timer can be active at a time. Trying to start a second timer prompts the user to stop the active timer first.
- **Persistence Across Page Refresh**: Active timer state is synchronized with MongoDB backend endpoints. Reloading or navigating between pages retains ongoing timer state.
- **Category Analytics (Recharts)**: Interactive Donut / Pie chart breaking down time per category.
- **Daily Totals Bar Chart (Recharts)**: Bar chart displaying tracked hours for each day over the past 7/14/30 days.
- **Session History & Filtering**: Filter session logs by Category, Date, or Activity Name with deletion capability.
- **SaaS Dark/Light Mode Theme**: Modern CSS variable design system with persistent light and dark themes.

---

## Technologies Used

### Frontend
- **React.js (v18)**: Component-based UI library
- **Vite**: Rapid frontend build tool & development server
- **JavaScript (JSX)**: Modern ECMAScript standard
- **React Router (v6)**: Client-side single page app routing
- **Recharts**: Responsive charting library for Pie and Bar charts
- **React Icons**: Modern vector icons
- **Vanilla CSS**: Custom CSS design system with CSS variables & micro-animations

### Backend
- **Node.js**: Asynchronous JavaScript runtime environment
- **Express.js**: REST API web framework
- **Cors & Dotenv**: Cross-Origin Resource Sharing & Environment variable configuration

### Database
- **MongoDB**: NoSQL database for document storage
- **Mongoose**: Object Data Modeling (ODM) library
- **MongoMemoryServer**: Automatic dev fallback if local MongoDB service is offline

---

## Project Directory Structure

```
Time Tracking Tool/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & memory fallback
│   ├── controllers/
│   │   ├── activityController.js # CRUD handlers for Activities
│   │   ├── sessionController.js  # Timer start/stop, active session, history
│   │   └── reportController.js   # Summary, category, and daily aggregations
│   ├── models/
│   │   ├── Activity.js           # Activity Mongoose schema
│   │   └── TimeSession.js        # TimeSession Mongoose schema
│   ├── routes/
│   │   ├── activityRoutes.js     # /api/activities endpoints
│   │   ├── sessionRoutes.js      # /api/sessions endpoints
│   │   └── reportRoutes.js       # /api/reports endpoints
│   ├── utils/
│   │   └── timeHelpers.js        # Timestamp formatting & math helpers
│   ├── .env                      # Server port & MongoDB connection string
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Sticky navbar with active timer status
│   │   │   ├── Sidebar.jsx       # Side navigation bar
│   │   │   ├── SummaryCard.jsx   # Statistic card component
│   │   │   ├── ActivityCard.jsx  # Activity item with controls
│   │   │   ├── Timer.jsx         # Live stopwatch widget
│   │   │   ├── CategoryChart.jsx # Recharts Pie/Donut breakdown
│   │   │   ├── DailyChart.jsx    # Recharts Bar chart for daily hours
│   │   │   ├── SessionTable.jsx  # History data table
│   │   │   └── Toast.jsx         # User feedback notifications
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Light/Dark mode provider
│   │   ├── hooks/
│   │   │   └── useTimer.js       # Timer logic & backend sync hook
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Overview page
│   │   │   ├── Activities.jsx    # Activity management page
│   │   │   ├── TimerPage.jsx     # Focused timer page
│   │   │   ├── Reports.jsx       # Detailed analytics page
│   │   │   └── History.jsx       # Session history page
│   │   ├── services/
│   │   │   └── api.js            # Axios client methods
│   │   ├── utils/
│   │   │   └── timeUtils.js      # Time formatting utilities
│   │   ├── App.jsx               # Main React router container
│   │   ├── main.jsx              # React DOM render entry
│   │   └── index.css             # SaaS CSS design system
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

---

## Step-by-Step Installation & Setup

### Prerequisites
- Node.js (v16.0 or higher) installed
- MongoDB installed locally OR MongoDB Atlas URI (Note: The server includes an automatic `mongodb-memory-server` fallback for offline testing).

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Environment Variables
Create or verify the `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/time_tracking_db
NODE_ENV=development
```

### Step 3: Install Frontend Dependencies
Open a new terminal tab and navigate to `client/`:
```bash
cd client
npm install
```

### Step 4: Run the Application

1. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend Client**:
   ```bash
   cd client
   npm run dev
   # Vite App runs on http://localhost:3000
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## API Endpoints Documentation

### 1. Activities (`/api/activities`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/activities` | Get all activities |
| `POST` | `/api/activities` | Create a new activity |
| `GET` | `/api/activities/:id` | Get activity by ID with linked sessions |
| `PUT` | `/api/activities/:id` | Update activity name, category, description |
| `DELETE` | `/api/activities/:id` | Delete activity and linked sessions |

### 2. Sessions & Timer (`/api/sessions`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/sessions/start` | Start timer for an activity |
| `POST` | `/api/sessions/stop` | Stop running timer & record duration |
| `GET` | `/api/sessions/active` | Get currently running timer session |
| `GET` | `/api/sessions` | Get session history (supports `?category=` & `?date=`) |
| `DELETE` | `/api/sessions/:id` | Delete session and deduct duration from activity |

### 3. Reports & Analytics (`/api/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/summary` | Today's total, overall total, activities & session count |
| `GET` | `/api/reports/category` | Category-wise duration & percentage aggregation |
| `GET` | `/api/reports/daily` | Daily total tracked hours for recent days |

---

## AI Tools Used & Representative Prompts

### AI Tools Utilized
- **Antigravity AI Coding Assistant**: Architectural design, React component construction, Express controller setup, CSS variable design system, and MongoDB schema optimization.

### Representative AI Prompts Used During Development
1. *"Design an Express & Mongoose schema for Activity and TimeSession where starting a timer enforces a single active running timer restriction across the whole application."*
2. *"Write a custom React hook `useTimer` that calculates elapsed duration using timestamp offsets `(currentTime - startTime)` so that refreshing the page doesn't reset the timer."*
3. *"Build a responsive SaaS dashboard using CSS variables with light/dark theme toggling, Recharts Donut chart for category tracking, and Bar chart for daily tracked time."*
4. *"Create a MongoDB aggregation query to group time sessions by date `(YYYY-MM-DD)` and calculate daily total tracked seconds and hours over the past 7 days."*

---

## Testing Strategy & Edge Case Verification

1. **Activity CRUD Testing**:
   - Added activities with valid & empty inputs.
   - Edited activity names and categories.
   - Deleted activities and confirmed cascading session deletion.
2. **Timer Accuracy & Refresh Test**:
   - Started a timer on "React Development".
   - Refreshed browser tab after 30 seconds -> Timer restored active session seamlessly without losing time.
   - Stopped timer -> Verified session saved to MongoDB and total tracked time updated on activity card.
3. **Single Timer Restriction Test**:
   - Attempted starting a second timer while one was running -> Backend returned 400 error message preventing duplicate running timers.
4. **Category & Daily Charts**:
   - Logged multiple sessions across different categories & days -> Verified Recharts Pie and Bar charts dynamically re-rendered database data.
5. **Responsive & Theme Verification**:
   - Tested light and dark theme toggle.
   - Tested UI layout on mobile, tablet, and desktop breakpoints.

---

## Application Screenshots

*(Placeholder sections for college project presentation screenshots)*

### 1. Dashboard Overview
![Dashboard Overview Placeholder](https://via.placeholder.com/800x450?text=Dashboard+Overview+Screenshot)

### 2. Activity Management
![Activity Management Placeholder](https://via.placeholder.com/800x450?text=Activities+Management+Screenshot)

### 3. Real-Time Active Timer
![Active Timer Placeholder](https://via.placeholder.com/800x450?text=Active+Timer+Screenshot)

### 4. Category-Wise Analytics (Recharts)
![Category Chart Placeholder](https://via.placeholder.com/800x450?text=Category+Analytics+Screenshot)

### 5. Daily Total Tracking
![Daily Chart Placeholder](https://via.placeholder.com/800x450?text=Daily+Total+Chart+Screenshot)

### 6. Time Session History
![Session History Placeholder](https://via.placeholder.com/800x450?text=Time+Session+History+Screenshot)

---

## Future Enhancements
- User Authentication (JWT + Bcrypt registration & login)
- Export session logs to CSV / PDF
- Weekly & monthly goal tracking with notifications
- Project & Tag tagging for granular task tracking

---
