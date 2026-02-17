# 💊 PillPal

<div align="center">

**Smart Medication Management System**

*Scan • Track • Adhere — before it's too late*

[![MakeUofT 2025](https://img.shields.io/badge/MakeUofT-2025-FF6B6B?style=for-the-badge)](https://makeuoft.ca)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Arduino](https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=arduino)](https://arduino.cc)

**[Features](#-features) • [App Flow](#-app-flow) • [Tech Stack](#️-tech-stack) • [Getting Started](#-getting-started)**

</div>

---

## 🚨 The Problem

Medication non-adherence is a silent crisis:

- 💀 **125,000 deaths** annually in the US caused by not taking medication correctly
- 🏥 **$300 billion** in avoidable healthcare costs every year
- 👴 Elderly patients managing **multiple prescriptions** with no system to verify compliance
- 🎓 University students forgetting doses during **high-stress periods like exams**
- 💊 Chronic condition patients asking **"did I already take my pill today?"** every single morning

**92% of missed doses are not intentional — people are simply busy, forgetful, or overwhelmed.**

---

## 💡 The Solution

PillPal is a **smart, hardware-integrated medication management system** that combines computer vision, IoT weight sensors, and a beautiful animated web app to make adherence effortless.

| Layer | What It Does |
|-------|-------------|
| 📸 **Computer Vision** | Scans prescription bottle labels with OpenCV + Tesseract OCR |
| ⚖️ **Arduino Sensors** | Load cell weight sensors detect when a pill is physically removed |
| 🌐 **Web App** | Animated 7-day tracker, drug encyclopedia, analytics, refill tracking |
| 📅 **Google Calendar** | Auto-creates 90-day recurring medication reminders |

**Philosophy:** *Make taking your medication as effortless and automatic as possible.*

---

## ✨ Features

### 🔐 Authentication

Clean login/signup flow with animated floating pills in the background.

**Includes:**
- Email + password login and sign-up
- Password reveal toggle
- Remember me checkbox
- Google Sign-In button
- Animated floating pill background during auth flow

---

### 💊 Weekly Pillbox Tracker

7-day interactive pillbox with hardware sensor integration.

**How it works:**
1. Your pillbox has Arduino load cell sensors under each compartment
2. When you remove a pill, the weight change is detected automatically
3. The UI updates in real time — no manual input needed
4. Google Calendar reminders fire if you haven't taken your pill by the scheduled time

**UI features:**
- Rainbow 7-day pillbox grid (Sunday → Saturday)
- Click any compartment to manually mark a pill as taken
- Confetti animation (80 particles) on every dose marked ✨
- Streak counter with 🔥 badge
- Missed day detection with pulsing red `!` indicator
- Green/red sensor status dots per compartment
- Glowing highlight on today's compartment
- 3D tilt hover effect on stats card and compartments

---

### 📸 Medication Scanner

Scan any prescription bottle label — the app extracts all the important info automatically.

**Scan flow:**

```
Camera → Scanning (OCR) → Success → Drug Info → Schedule Setup → Google Calendar
```

**Camera step** — Live webcam with animated corner brackets and sweeping cyan scan line

**Scanning step** — Image sent to backend OpenCV + Tesseract OCR pipeline. Falls back to demo data if backend is unavailable.

**Drug Information Encyclopedia** — After detecting a medication, shows a full info card:

| Section | Contents |
|---------|----------|
| 🏷️ Also Known As | All brand name aliases |
| ✅ What It Treats | Full list of conditions the medication addresses |
| ⚠️ Side Effects | Common side effects to be aware of |
| 🚨 Warnings | Critical usage warnings and interactions |

Medications currently in the database:

| Medication | Dosage | Category | Brand Names |
|------------|--------|----------|-------------|
| Lisinopril | 10mg | ACE Inhibitor | Prinivil, Zestril |
| Metformin | 500mg | Antidiabetic (Biguanide) | Glucophage, Fortamet, Glumetza |
| Atorvastatin | 20mg | Statin | Lipitor |
| Amlodipine | 5mg | Calcium Channel Blocker | Norvasc |

**Schedule Setup** — Choose 1x / 2x / 3x daily with a time picker for each dose

**Google Calendar** — Opens a pre-filled event with:
- 1-hour event duration (visible in calendar view, not a tiny 15-min block)
- 90-day daily recurrence (`RRULE:FREQ=DAILY;COUNT=90`)
- Medication name, dosage, instructions, and dose times in the description

---

### 🔔 Refill Tracker

Amazon-style order tracking so you always know where your refill is.

**5 tracking stages:**

```
Order Received → Being Prepared → Ready for Pickup → Out for Delivery → Delivered
```

**Features:**
- Animated progress bar across all 5 stages
- 🚚 Bouncing truck animation when out for delivery
- Animated route line from pharmacy 🏥 → home 🏠
- Wiggling ✅ animation when ready for pickup
- Pharmacy contact card with call and directions buttons
- Automatic refill alert banner when ≤ 2 days of pills remain

---

### 📊 Analytics Dashboard

Full adherence analytics with interactive charts.

| Chart | What It Shows |
|-------|--------------|
| 📅 Bar Chart | Daily doses taken vs missed for the current week |
| 📈 Line Chart | 6-month adherence percentage trend |
| 🥧 Pie Chart | Medication type breakdown |
| 💡 Insights | 4 auto-generated tips based on your adherence patterns |

**Stat cards:** Overall Adherence · Current Streak · Best Streak · Total Doses Taken

---

### 🌙 Dark Mode

One-click toggle in the top navbar (☀️ → 🌙) with smooth spring animation. Applied across all screens.

---

### 💫 Splash Screen

Animated loading screen when the app first opens:
- 5 bouncing pill circles on a sky-blue gradient
- Progress bar counting 0 → 100% over ~3 seconds
- 20 floating background particles
- Transitions automatically into the login screen

---

## 📐 The Math

Weekly adherence rate:

$$\text{Adherence} = \frac{\text{Doses Taken}}{7} \times 100\%$$

Refill alert triggers when:

$$\text{Days Remaining} = 7 - \text{Doses Taken} \leq 2$$

Streak counter (resets on first missed day):

$$\text{Streak} = \sum_{i=0}^{\text{today}} \mathbb{1}[\text{day}_i = \text{taken}]$$

Arduino sensor pill detection uses a weight threshold:

$$\text{Pill Removed} = \begin{cases} \text{True} & \text{if } w_{\text{measured}} < w_{\text{baseline}} - \delta \\ \text{False} & \text{otherwise} \end{cases}$$

where \\( \delta \\) is the minimum detectable pill weight, calibrated per medication type during setup.

---

## 🛠️ Tech Stack

```
Frontend:  React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Vite
Hardware:  Arduino, Load Cell Sensors, ESP32
CV:        OpenCV, Tesseract OCR (Python backend)
Calendar:  Google Calendar URL API
Backend:   Node.js, Express.js
Camera:    react-webcam
```

### Architecture

```
┌──────────────────────┐
│   PillPal Web App    │  (React + TypeScript)
│   Weekly Tracker UI  │
└──────────┬───────────┘
           │ POST /scan-image
           ↓
┌──────────────────────────┐
│   OCR Backend            │  (OpenCV + Tesseract)
│   • Read prescription    │
│   • Extract name/dosage  │
│   • Return JSON          │
└──────────┬───────────────┘
           │ POST /add-medication
           ↓
┌──────────────────────────┐
│   Arduino Sensor Layer   │
│   • Load cell per day    │
│   • Weight threshold     │
│   • Auto mark as taken   │
└──────────────────────────┘
```

---

## 🔌 Backend API

PillPal connects to these endpoints with **automatic demo fallback** if the backend is offline:

```
POST http://localhost:3000/scan-image
Body:    { image: "base64...", timestamp: "ISO string" }
Returns: { name, dosage, instructions, patientName }

POST http://localhost:3000/add-medication
Body:    { medication: {...}, schedule: { frequency, times }, timestamp: "ISO string" }
Returns: { success: true }
```

---

## 🚀 App Flow

```
Splash Screen (3s loading animation)
         ↓
   Login / Sign Up
         ↓
   Landing Page (animated pillbox demo)
         ↓
     "Start Tracking"
         ↓
      Weekly View
       ├── Click compartment → mark as taken + confetti 🎉
       ├── 💊 Floating button (bottom right) → view / delete medications
       ├── ＋ Floating button (bottom right) → ScanFlow
       │       ├── 📸 Camera (live webcam)
       │       ├── 🔍 Scanning (OCR backend or mock fallback)
       │       ├── ✅ Medication detected
       │       ├── 📖 Drug information encyclopedia
       │       ├── ⏰ Schedule setup (frequency + dose times)
       │       └── 📅 Add to Google Calendar (90-day recurring)
       ├── 🔔 Track Refill Status → Refill Tracker
       └── 📊 View Analytics → Analytics Dashboard
```

---

## ⚙️ Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Clone the repo
git clone https://github.com/sansitamalhotra/makeUofT.git
cd makeUofT

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser 🎉

> **Note:** The app runs fully in demo mode without the backend. To enable real OCR scanning and Arduino sensor tracking, run the backend server at `http://localhost:3000`.

### Running with Backend

```bash
# Terminal 1: Start the backend (OCR + Arduino bridge)
cd backend
npm start
# Runs on localhost:3000

# Terminal 2: Start the frontend
npm run dev
# Runs on localhost:5173
```

---

## 👥 Team

**Built at MakeUofT 2025 (University of Toronto)**

| Name | Role |
|------|------|
| **Sansita Malhotra** | Frontend — React/TypeScript, animations, Google Calendar integration, UI/UX |
| Teammate 2 | Backend — OpenCV + Tesseract OCR prescription scanning pipeline |
| Teammate 3 | Hardware — Arduino load cell sensors + weight detection logic |
| Teammate 4 | Hardware — Arduino load cell sensors + ESP32 WiFi integration |

---

## 🔮 What's Next

**Phase 1: Hackathon MVP** ✅ *(Current)*
- [x] Splash screen + auth flow
- [x] Animated 7-day pillbox tracker
- [x] Prescription label scanning (OCR backend)
- [x] Drug information encyclopedia
- [x] Google Calendar integration (90-day recurring)
- [x] Refill tracker with delivery stages
- [x] Analytics dashboard with charts
- [x] Dark mode
- [x] Arduino sensor integration (hardware team)

**Phase 2: Post-Hackathon**
- [ ] Real-time WebSocket connection between Arduino sensors and UI
- [ ] Expanded drug database beyond 4 medications
- [ ] Push notifications for missed doses
- [ ] Caregiver / family account sharing
- [ ] Real pharmacy API for live refill tracking
- [ ] Mobile app (React Native)

---

<div align="center">

**Built with 💊 at MakeUofT 2025**

*Reducing the 125,000 annual deaths from medication non-adherence — one pill at a time.*

[![GitHub Stars](https://img.shields.io/github/stars/sansitamalhotra/makeUofT?style=social)](https://github.com/sansitamalhotra/makeUofT)

[Report Bug](https://github.com/sansitamalhotra/makeUofT/issues) • [Request Feature](https://github.com/sansitamalhotra/makeUofT/issues)

</div>
