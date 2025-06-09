# Manao Fitness 🏋️‍♂️

**Manao Fitness** is a modern web application for guided fitness workouts with automatic timers. Built for French-speaking users, it provides structured workout sessions with real-time progress tracking and session management.

## ✨ Features

### 🎯 Workout Programs
- **Full Body** (🏋️‍♂️): Complete body strengthening - 30-40 min, 3 rounds
- **Core & Gainage** (💪): Core strengthening and planks - 25-35 min, 4 rounds  
- **HIIT** (⚡): High-intensity interval training - 20-30 min, 4 rounds

### 🕒 Smart Timer System
- Automatic exercise timers with audio cues
- Rest periods between exercises and rounds
- Visual countdown displays
- Progress tracking throughout workouts

### 📊 Progress Tracking
- Session history and statistics
- Total workout time tracking
- Weekly progress monitoring
- Workout completion rates

### 🎛️ User Experience
- **Session Resume**: Automatically save and resume interrupted workouts
- **Settings**: Customize sound preferences and difficulty levels
- **Onboarding**: Guided setup for new users
- **Mobile-First**: Responsive design optimized for mobile devices
- **PWA Ready**: Progressive Web App capabilities

### 🔐 Authentication
- Secure authentication via Replit Auth
- User profile management
- Session persistence

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Radix UI** for accessible components
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **PostgreSQL** with Drizzle ORM
- **Replit Auth** for authentication
- **WebSocket** support for real-time features

### Development
- **TypeScript** for type safety
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Replit account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/manao-fitness.git
   cd manao-fitness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   REPL_ID=your_replit_id
   REPL_SLUG=your_replit_slug
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## 📱 Usage

### Starting a Workout
1. Select one of the three available workout programs
2. The app guides you through each exercise with automatic timers
3. Rest periods are automatically managed between exercises and rounds
4. Visual and audio cues help maintain proper timing

### Workout Session Features
- **Play/Pause**: Control workout flow
- **Exercise Instructions**: Detailed guidance for each movement
- **Progress Tracking**: See current round, exercise, and overall progress
- **Session Resume**: Interrupted workouts are automatically saved

### Settings & Preferences
- Toggle sound notifications
- Adjust difficulty levels
- Set preferred workout types
- View workout history and statistics

## 🏗️ Project Structure

```
manao-fitness/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database connection
│   └── replitAuth.ts     # Authentication setup
├── shared/               # Shared code
│   └── schema.ts         # Database schema & types
└── package.json          # Dependencies and scripts
```

## 🎮 Available Workouts

### Full Body Workout
**Duration**: 30-40 minutes | **Rounds**: 3 | **Rest**: 30s between exercises, 60s between rounds

- Squats (20 reps)
- Push-ups (15 reps, knees if needed)
- Lunges (20 reps, 10 each side)
- Plank (30 seconds)
- Jumping Jacks (20 reps)

### Core & Gainage
**Duration**: 25-35 minutes | **Rounds**: 4 | **Rest**: 15s between exercises, 60s between rounds

- Classic Plank (30s)
- Right Side Plank (30s)
- Left Side Plank (30s)
- Crunches (15 reps)
- Bicycle Crunches (20 reps)
- Mountain Climbers (20 reps)
- Leg Raises (15 reps)

### HIIT Training
**Duration**: 20-30 minutes | **Rounds**: 4 | **Rest**: 15s between exercises, 60s between rounds

- Burpees (30s)
- Air Squats (30s)
- Push-ups (30s)
- High Knees (30s)
- Jumping Lunges (30s)
- Dynamic Plank (30s)

## 🔧 API Endpoints

- `GET /api/workout-stats` - Get user workout statistics
- `GET /api/workout-progress` - Get current workout progress
- `POST /api/workout-sessions` - Save completed workout session
- `GET /api/user-preferences` - Get user preferences
- `POST /api/user-preferences` - Update user preferences
- `POST /api/workout-progress` - Save/update workout progress
- `DELETE /api/workout-progress` - Clear workout progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with mobile-first approach for fitness enthusiasts
- Focused on French-speaking users with localized content
- Optimized for Replit hosting platform

---

**Ready to start your fitness journey? Launch Manao Fitness and get moving! 💪** 