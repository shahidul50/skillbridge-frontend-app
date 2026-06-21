# 🎓 SkillBridge - Online Tutoring Marketplace

SkillBridge is a modern online tutoring platform where students can find expert tutors across various subjects and book sessions directly. It is a full-stack web application featuring role-based access for Admins, Tutors, and Students.

---

## 🚀 Live Demo

[https://skillbridge-frontend-app.vercel.app](https://skillbridge-frontend-app.vercel.app)

---

## 📖 Key Features

### 🌐 Core Features

- **Modern UI/UX:** A sleek and responsive design built with TailwindCSS and Shadcn/UI.
- **Role-Based Access Control (RBAC):** Dedicated dashboards and permissions for Admins, Tutors, and Students.
- **Advanced Search & Filter:** Easily find tutors by subject, rating, and category.
- **Real-time Calendar:** Integrated FullCalendar for seamless session booking and scheduling.
- **Secure Authentication:** Robust authentication system powered by Better Auth.

### 👨‍🎓 Student Dashboard

- **Session Booking:** View tutor availability and book slots effortlessly.
- **Booking History:** Track all current, upcoming, and past tutoring sessions.
- **Profile Management:** Update personal information and account settings.

### 👨‍🏫 Tutor Dashboard

- **Dynamic Scheduling:** Manage weekly availability slots and set date-specific exceptions.
- **Subject Expertise:** List and categorize teaching subjects based on expertise levels.
- **Student Insights:** Track session bookings and view student feedback.

### 🔑 Admin Panel

- **User Moderation:** Full control over Student and Tutor accounts, including Ban/Unban functionality.
- **Platform Analytics:** Monitor total sessions, user growth, and active bookings.
- **Category Management:** Dynamically add or edit learning categories and subjects.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS, Shadcn/UI, Radix UI
- **Animations:** Framer Motion
- **Form Management:** TanStack Form, Zod
- **Authentication:** Better Auth
- **Data Visualization:** Recharts
- **Icons:** Lucide React

---

## 💻 Local Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/shahidul50/skillbridge-frontend-app.git
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

   _(Alternatively, use `npm install` or `yarn install`)_

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add:

   ```env
   NEXT_PUBLIC_BACKEND_URL=your_backend_url
   AUTH_URL=your_auth_api_url
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🗺️ Route Overview

### 1. Public Routes

- `/` - Landing Page
- `/tutors` - Browse Tutors
- `/tutors/:id` - Tutor Profile & Booking
- `/login` / `/register` - Authentication

### 2. Private Routes (Protected by Role)

- `/dashboard/*` - Student Dashboard
- `/tutor-dashboard/*` - Tutor Dashboard
- `/admin-dashboard/*` - Admin Panel

---

## 📂 Project Structure

```text
src/
├── actions/          # Next.js Server Actions for data mutations
├── app/              # App Router (Pages, Layouts, and API routes)
├── components/       # Reusable UI and layout components
├── constants/        # Application-wide roles and constants
├── env.ts            # Environment variable validation schema
├── hooks/            # Custom React hooks
├── lib/              # External library configs (Auth, Utils)
├── providers/        # Client-side context providers
├── services/         # API service layers
└── types/            # Global TypeScript definitions
```

---
