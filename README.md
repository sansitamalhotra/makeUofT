💊 PillPal - Smart Medication Management System

Built at MakeUofT 2025 | A smart medication management system tackling the \( 125{,}000 \) annual deaths caused by medication non-adherence.

Show Image
Show Image
Show Image
Show Image
Show Image

🌟 Inspiration
Medication non-adherence affects everyone — university students juggling exams, elderly patients managing chronic conditions, anyone whose life gets busy. Missing a single dose of blood pressure medication or insulin can have life-threatening consequences.
We asked: what if your pillbox could think for itself?

🎯 What It Does
PillPal is a full-stack smart medication management system with three integrated layers:
1. Frontend Web App (this repo) — React/TypeScript interface with animated 7-day pillbox, drug information encyclopedia, adherence analytics, and refill tracking.
2. Computer Vision Backend — Teammate-built OpenCV + Tesseract OCR pipeline that reads prescription bottle labels and returns structured medication data.
3. Arduino Hardware — Load cell weight sensors beneath each pillbox compartment automatically detect when a pill is removed, updating the UI in real time.

✨ Features
🔐 Authentication

Login and sign-up with email and password
Password reveal toggle
Remember me option
Google Sign-In button (UI only)
Floating animated pill background during auth flow

💊 Animated Pillbox (Weekly Tracker)

7-day rainbow pillbox grid (Sunday → Saturday)
Click any compartment to mark a pill as taken
Confetti animation (80 particles) on every dose marked
Streak counter with 🔥 indicator
Missed day detection with pulsing red ! badge
Green sensor status dots per compartment (shows pill count or "Missed!")
Glowing highlight on today's compartment

📊 Adherence Stats Card

Animated percentage counter (adherence this week)
Animated taken / remaining counters
SVG progress ring with blue → purple → pink gradient
3D tilt effect on hover (uses useMotionValue / useTransform)

🏆 Achievements

3-Day Streak badge
5-Day Streak badge
Perfect Week badge with spring animation

📸 Medication Scanner (ScanFlow)
Camera Step

Live webcam feed via react-webcam
Animated scanning frame with corner brackets and sweeping cyan line
Sends image to backend at POST /scan-image (OpenCV/Tesseract)
Falls back to mock data if backend is unavailable

Scanning Step

Spinning 8-dot loading animation
Progress bar animating to 100%

Success Step

Shows detected medication name, dosage, and instructions
Retake or proceed to drug info

📖 Drug Information Encyclopedia (NEW)
For each detected medication, shows:

Generic name and brand name aliases
Category badge (e.g. ACE Inhibitor, Statin)
What it treats (green card)
Possible side effects (orange card)
Important warnings (red card)
Medical disclaimer

Medications in the database:
MedicationGeneric NameBrand NamesCategoryLisinoprilLisinoprilPrinivil, ZestrilACE InhibitorMetforminMetformin HydrochlorideGlucophage, Fortamet, GlumetzaAntidiabeticAtorvastatinAtorvastatin CalciumLipitorStatinAmlodipineAmlodipine BesylateNorvascCalcium Channel Blocker
Schedule Setup Step

Choose frequency: 1x / 2x / 3x daily
Time picker for each dose
Sends schedule to backend at POST /add-medication (for Arduino tracking)
Falls back gracefully if backend unavailable

Google Calendar Integration

Generates a Google Calendar URL with:

1-hour event duration
90-day daily recurrence (RRULE:FREQ=DAILY;COUNT=90)
Medication name, dosage, instructions, and times in description


Opens in a 1000×800 popup window

💊 Medication Management Modal

View all scanned medications
Delete individual medications (× button)
Shows schedule info per medication
Floating purple 💊 button (bottom right)

🔔 Refill Tracker

Amazon-style order tracking with 5 stages:

Order Received
Being Prepared
Ready for Pickup
Out for Delivery
Delivered


Animated progress bar across stages
🚚 Bouncing truck animation for "out for delivery"
Animated route line (pharmacy → home)
✅ Wiggling checkmark for "ready for pickup"
Pharmacy info card with call and directions buttons
Mock orders: Lisinopril (out for delivery) + Metformin (ready for pickup)
Refill alert banner when ≤ 2 days of pills remain

📈 Analytics Dashboard

4 stat cards: Overall Adherence (92%), Current Streak (5 days), Best Streak (14 days), Total Doses (147)
Bar chart: Weekly taken vs missed (Recharts)
Line chart: 6-month adherence trend (Recharts)
Pie chart: Medication breakdown by type (Recharts)
Insights panel: 4 auto-generated tips
Export Full Report button (UI only)

🌙 Dark Mode

Toggle in the top navbar (☀️ / 🌙)
Smooth spring animation between states
Applied across all screens: WeeklyView, RefillTracker, AnalyticsDashboard

🏥 Pharmacy Dashboard

Separate mode toggled from the top navbar (Patient / Pharmacy)
Pharmacy-themed green/emerald gradient

👤 Profile Page

User avatar with green online indicator
Stats: 12 medications, 94% adherence, 28-day streak
Settings menu: notifications, calendar, providers, reports, app settings
Logout button
3D tilt hover effect

💫 Splash Screen

Animated loading screen on app start
5 bouncing pill circles
Progress bar from 0 → 100% over ~3 seconds
20 floating background particles
Transitions to login screen on complete


🔌 Backend API (Expected Endpoints)
Your frontend is wired to communicate with these endpoints:
POST http://localhost:3000/scan-image
Body: { image: "base64...", timestamp: "ISO string" }
Returns: { name, dosage, instructions, patientName }

POST http://localhost:3000/add-medication
Body: { medication: {...}, schedule: {...}, timestamp: "ISO string" }
Returns: { success: true }
If the backend is unreachable, the app falls back to mock data automatically — making it fully demoable standalone.

🛠️ Tech Stack
LayerTechnologyFrameworkReact 18 + TypeScriptBuild ToolViteStylingTailwind CSSAnimationsFramer MotionChartsRechartsCamerareact-webcamCalendarGoogle Calendar URL APICV BackendOpenCV + Tesseract OCR (teammate)HardwareArduino + Load Cell Sensors (teammates)

🚀 Getting Started
Prerequisites

Node.js 18+
npm

Installation
bash# Clone the repo
git clone https://github.com/sansitamalhotra/makeUofT.git
cd makeUofT

# Install dependencies
npm install

# Start the dev server
npm run dev
Open http://localhost:5173 in your browser.
Running with Backend
Make sure your teammates' backend server is running at http://localhost:3000 before scanning. If it's not running, the app will fall back to demo mode automatically.

📱 App Flow
Splash Screen (3s loading)
        ↓
  Login / Sign Up
        ↓
  Landing Page (animated pillbox)
        ↓
  Click "Start Tracking"
        ↓
  Weekly View (7-day tracker)
    ├── Click compartment → mark as taken + confetti
    ├── 💊 button → view/delete medications
    ├── + button → ScanFlow
    │     ├── Camera → Capture
    │     ├── Scanning animation
    │     ├── Success → Drug Info Encyclopedia
    │     ├── Set Schedule (frequency + times)
    │     └── Add to Google Calendar
    ├── 🔔 Track Refill Status → RefillTracker
    └── 📊 View Analytics → AnalyticsDashboard

🧠 Adherence Math
Weekly adherence is calculated as:
Adherence Rate=Doses TakenTotal Days×100%\text{Adherence Rate} = \frac{\text{Doses Taken}}{\text{Total Days}} \times 100\%Adherence Rate=Total DaysDoses Taken​×100%
Refill alerts trigger when:
Days Remaining=7−Doses Taken≤2\text{Days Remaining} = 7 - \text{Doses Taken} \leq 2Days Remaining=7−Doses Taken≤2
The streak counter uses:
Streak=∑i=0today1(dayi taken)(resets on first missed day)\text{Streak} = \sum_{i=0}^{\text{today}} \mathbb{1}(\text{day}_i \text{ taken}) \quad \text{(resets on first missed day)}Streak=i=0∑today​1(dayi​ taken)(resets on first missed day)

👥 Team
NameRoleSansita MalhotraFrontend — React/TypeScript UI, animations, Google Calendar integrationTeammate 2Backend — OpenCV + Tesseract OCR prescription scanningTeammate 3Hardware — Arduino load cell sensors + ESP32 integrationTeammate 4Hardware — Arduino load cell sensors + weight detection

🔮 What's Next

 Real-time WebSocket connection between Arduino sensors and UI
 Push notifications for missed doses
 Multi-medication pillbox support
 Caregiver/family account sharing
 Expanded drug database (beyond 4 medications)
 Real pharmacy API integration for refill tracking
 Mobile app (React Native)


📄 License
Built for MakeUofT 2025. All rights reserved.
