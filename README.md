# 🎓 CampusConnect — College Events Platform

A centralized, responsive college event management web application for students and administrators built using **React 19**, **Vite**, **Tailwind CSS**, and **React Router**.

---

## 🌟 Overview

College students often receive event notices across disconnected platforms (WhatsApp groups, physical noticeboards, Instagram stories, and departmental emails). **CampusConnect** solves this by centralizing event discovery, registration, and administration in one unified platform.

---

## ✨ Features

### 👨‍🎓 Student Experience
- **Discovery Feed:** Browse upcoming college hackathons, cultural fests, sports tournaments, workshops, and guest lectures.
- **Instant Live Search:** Real-time search by event name, venue, or keywords with quick keyboard shortcut (`/`).
- **Category Filtering:** Filter across *Technical, Cultural, Sports, Workshops, Seminars, and Social* with dynamic counter badges.
- **Event Details:** View comprehensive schedules, prerequisites, venue location, capacity, and verified organizer contacts.
- **One-Click RSVP:** Instant registration enforcing seat limits and preventing duplicate registrations per student ID.
- **Digital Campus Pass:** Perforated digital admission ticket with scannable QR code and printable view.
- **My Passes & Bookmarks:** Dedicated wallet to view confirmed tickets and saved events.

### 🛡️ Admin Studio
- **Event Lifecycle (CRUD):** Create new events, edit schedules, and delete cancelled events with safety confirmations.
- **Capacity & Registration Tracking:** Monitor live attendance fill rates across campus halls and auditoriums.
- **Attendee Roster:** View full student attendee lists per event with search and **Export to CSV** capability.
- **Interactive Persona Switcher:** One-click toggle between *Student View* and *Admin View* with sample data reset utility.

---

## 🚀 Tech Stack

- **Frontend:** React 19, JavaScript (ES6+), Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Routing:** React Router v7 (`react-router-dom`)
- **Data Persistence:** Modular `localStorage` abstraction layer (ready for Supabase migration)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shadow-18-creator/bottcamp-project-from-antigravity.git
   cd bottcamp-project-from-antigravity
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5173/](http://localhost:5173/)

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🏛️ System Architecture

```text
src/
├── components/
│   ├── admin/         # EventFormModal, DeleteConfirmModal, AttendeeListModal, StatCards
│   ├── common/        # Button, Badge, Modal, EmptyState
│   ├── events/        # EventCard, EventGrid, SearchBar, CategoryFilter
│   ├── layout/        # Navbar, RoleBanner, Footer
│   └── registration/  # RegisterModal, DigitalTicket
├── context/           # RoleContext (RBAC), ToastContext (Notifications)
├── hooks/             # useEvents, useBookmarks, useRegistrations
├── pages/             # HomePage, EventDetailPage, MyEventsPage, AdminDashboard
├── services/          # eventService, registrationService, bookmarkService, storage
└── utils/             # constants, dateUtils
```

---

## 📄 License
MIT License. Built for collegiate campus engagement.
