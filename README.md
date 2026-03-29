# Simple Streaks 🔥

A habit tracking web app built with React and Firebase. Track your daily habits, build streaks, and visualize your consistency with a heatmap.

## Live Demo

## Features
- Google sign-in via Firebase Auth
- Add and delete daily habits
- Check off habits each day
- Streak counter per habit — resets if you miss a day
- Background shifts red to green when all habits are complete
- 91-day activity heatmap showing completion history
- Data syncs in real time via Firestore

## Tech Stack
- React
- Vite
- Firebase (Authentication + Firestore)

## Running Locally

1. Clone the repo
```
   git clone https://github.com/owenlovett/habit-tracker.git
   cd habit-tracker
```

2. Install dependencies
```
   npm install
```

3. Create a `.env` file in the root with your Firebase config
```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=...
```

4. Start the dev server
```
   npm run dev
```

## Author
Owen Lovett