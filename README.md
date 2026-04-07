# 🎓 SkillBridge - Connect with Expert Tutors

**SkillBridge** is a cutting-edge, high-performance tutoring platform built with **Next.js 16**. It bridges the gap between learners and expert mentors with a focus on real-time data handling, SEO-optimized layouts, and a seamless user experience using the latest server-side innovations.

---

## 🚀 Live Demo
[Insert your live link here, e.g., https://skillbridge-frontend.vercel.app]

## 📖 Key Features

### 🌍 Public Features
- **Modern Landing Page:** Featuring a sleek Hero section, Explore Categories, Featured Tutors, "How it Works," and a global Navbar/Footer.
- **Advanced Search & Filter:** Dynamic filtering system for tutors by subject, rating, price, and category.
- **Tutor Profiles:** In-depth view of tutor experience, student reviews, and instant booking availability.

### 👨‍🎓 Student Features
- **Session Booking:** Effortless booking flow for tutoring sessions.
- **Booking Management:** Real-time tracking of upcoming and past sessions.
- **Feedback Loop:** Post-session rating and review system for quality assurance.
- **Personalized Profile:** Manage learning preferences and account details.

### 👨‍🏫 Tutor Features
- **Dynamic Scheduling:** Set recurring availability slots and manage specific **Date Exceptions**.
- **Subject Expertise:** Add and categorize subjects based on experience level.
- **Performance Analytics:** Visual overview of teaching sessions, ratings, and feedback.
- **Profile Customization:** Update professional bio, expertise, and teaching styles.

### 🔑 Admin Features
- **User Moderation:** Full control over student and tutor accounts (Ban/Unban functionality).
- **System Oversight:** Monitor all platform-wide bookings and activities.
- **Content Management:** Dynamically add/edit categories and configure payment gateways.

---

## 🛠️ Tech Stack & Architecture

This project is built using the **Next.js 16 ecosystem**, emphasizing server-first patterns:

- **Framework:** **Next.js 16 (App Router)**
- **Data Management:**
  - **Server Actions:** All data mutations and fetching are handled via secure, type-safe Server Actions.
  - **Advanced Caching:** Leverages Next.js 16's enhanced Data Cache and Request Memoization (eliminating the need for complex external state like Redux).
- **Dashboard Layouts:** **Parallel Routes** are implemented for highly organized and simultaneous views within user dashboards.
- **Form Handling:** **TanStack Form** (React Query Form) integrated with **Shadcn UI** and **Zod** for high-performance, type-safe validation.
- **Styling:** Tailwind CSS with **Shadcn UI** components.
- **Icons:** Lucide React.

---

## 💻 Local Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/skillbridge-frontend.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file and add your backend API URL:
    ```env
    NEXT_PUBLIC_API_URL=your_backend_api_url
    ```

4.  **Start the server:**
    ```bash
    npm run dev
    ```

## 🗺️ Route Overview

### 1. Public Routes
| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Home** | Navbar, Hero, Categories, Featured Tutors, How it works. |
| `/tutors` | **Browse Tutors** | Advanced search and filterable listing. |
| `/tutors/:id` | **Tutor Profile** | Detailed biography, reviews, and booking. |
| `/login` | **Login** | Secure authentication portal for all roles. |
| `/register` | **Register** | Account creation for Students and Tutors. |

### 2. Student Routes (Private)
| Route | Page | Description |
| :--- | :--- | :--- |
| `/dashboard` | **Overview** | Parallel route view for profile & activity stats. |
| `/dashboard/bookings`| **My Bookings** | Full history of sessions and schedules. |
| `/dashboard/profile` | **Profile** | Student information and settings. |

### 3. Tutor Routes (Private)
| Route | Page | Description |
| :--- | :--- | :--- |
| `/tutor-dashboard` | **Dashboard** | Teaching overview and session statistics. |
| `/tutor-dashboard/availability` | **Availability** | Recurring weekly time slot management. |
| `/tutor-dashboard/exceptions` | **Exceptions** | Date-specific unavailability management. |
| `/tutor-dashboard/profile` | **Profile** | Professional bio and experience updates. |
| `/tutor-dashboard/my-subjects` | **My Subjects** | Teaching subject and expertise management. |

### 4. Admin Routes (Private)
| Route | Page | Description |
| :--- | :--- | :--- |
| `/admin` | **Dashboard** | Platform-wide metrics and analytics overview. |
| `/admin/users` | **Users** | Management of all Students and Tutors. |
| `/admin/bookings` | **Bookings** | Overview of all transactions and sessions. |
| `/admin/categories` | **Categories** | Subject and category management. |

---

## 📂 Project Structure
```text
src/
├── actions/          # Next.js Server Actions (Secure Data Mutations)
├── app/              # Next.js 16 App Router (Parallel Routes, Layouts & Pages)
├── components/       # Shadcn UI & Custom Reusable UI Components
├── constant/         # Global constant variables and static data
├── lib/              # Custom library configurations and third-party setups
├── providers/        # Global context providers (Theme, Auth, Query Providers)
├── routes/           # Centralized management for Dashboard and Sidebar routes
├── services/         # API Layer, business logic, and data fetching services
├── types/            # Global TypeScript interfaces and type definitions
└── utils/            # Shared helper functions and utility modules
```
---

