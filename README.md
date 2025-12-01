# ClockIn - Weekly Presence Management System

ClockIn is a comprehensive web application designed for organizations to manage employee weekly presence plans (Office, Home, Vacation, etc.). It facilitates coordination within teams, ensures compliance with company hybrid work policies, and provides detailed analytics for HR and Admins.

## 🌟 Features

### 👤 Employee
*   **Weekly Planning**: Interactive weekly calendar to set status (Office, Home, etc.) for each day.
*   **Team Visibility**: View "Who's in the Office" and weekly schedules of teammates.
*   **History**: Access and copy plans from previous weeks.
*   **Notifications**: Reminders for submission deadlines.

### 👥 Team Lead
*   **Team Management**: View full team schedules in a unified table.
*   **Approvals**: Approve or reject weekly plans submitted by team members.
*   **Mandatory Dates**: Set specific days where team presence is mandatory (e.g., Team Days).
*   **Coverage Alerts**: Warnings if no one is scheduled for the office on specific days.

### 📊 HR
*   **Dashboard**: High-level metrics on Compliance Rate, Approval Rate, and Presence Distribution.
*   **Daily Snapshot**: Detailed view of who is where on any specific date.
*   **History & Trends**: Analyze presence data over time.
*   **Filtering**: Filter data by Team, User, Date Range, or Status.

### ⚙️ Admin
*   **User Management**: Add/Edit/Delete users, assign roles, and manage team structures.
*   **System Settings**: Configure global work policies (e.g., Min 3 office days).
*   **Status Configuration**: Customize presence statuses (icons, colors, labels).
*   **Audit Log**: Track system activities.

---

## 🏗️ Architecture

The application follows a standard Client-Server architecture.

```mermaid
graph TD
    subgraph Client
        Browser[User Browser]
        ReactApp[React SPA (Vite)]
    end

    subgraph Server
        API[Node.js / Express API]
        Auth[JWT Authentication]
    end

    subgraph Database
        Mongo[(MongoDB)]
    end

    subgraph External
        Google[Google OAuth 2.0]
    end

    Browser --> ReactApp
    ReactApp -- HTTP/JSON --> API
    API -- Mongoose --> Mongo
    ReactApp -- "Sign In" --> Google
    API -- "Verify Token" --> Google
```

---

## 📂 File Structure

```text
/
├── index.html              # Entry HTML
├── index.tsx               # React Entry point
├── App.tsx                 # Main Application Router & State Manager
├── types.ts                # TypeScript Interfaces & Enums
├── constants.tsx           # Mock Data, Icons, Translations, Config
├── components/             # React Components
│   ├── Header.tsx          # Navigation, Theme, Language, Profile
│   ├── Login.tsx           # Login Screen (Google Auth integration)
│   ├── Dashboard.tsx       # HR Dashboard with Charts (Recharts)
│   ├── EmployeeDashboard.tsx # Wrapper for Employee Views
│   ├── WeeklyPlanner.tsx   # Core Planning Component
│   ├── TeamView.tsx        # Team Lead Management Table
│   ├── AdminView.tsx       # Admin Settings & User Management
│   ├── MyTeamStatus.tsx    # Employee view of team locations
│   └── ... (Modals, Badges, etc.)
└── backend/                # Backend API
    ├── server.js           # Express App & Routes
    ├── models.js           # Mongoose Schemas (User, Team, Plan)
    └── package.json        # Backend Dependencies
```

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 18
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (Dark Mode supported)
*   **Charts**: Recharts
*   **Build Tool**: Vite (implied by structure)

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Auth**: Google OAuth 2.0 + JWT

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Google Cloud Project (for OAuth Client ID)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in `backend/`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/clockin
    JWT_SECRET=your_jwt_secret_key
    GOOGLE_CLIENT_ID=your_google_client_id
    ```
4.  Start the server:
    ```bash
    npm start
    ```

### 2. Frontend Setup

1.  Navigate to the project root.
2.  Install dependencies (assuming `package.json` exists, or install manually):
    ```bash
    npm install react react-dom @types/react @types/react-dom recharts lucide-react
    ```
3.  Configure Google Client ID:
    Update `components/Login.tsx` with your `GOOGLE_CLIENT_ID`.
4.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🎨 Customization

### Adding a New Presence Status
1.  Go to **Admin Panel** > **Status Configuration**.
2.  Enter Label (e.g., "Client Site"), Color, and Icon.
3.  Click **Add Status**.
4.  It immediately becomes available in the Weekly Planner.

### Changing Work Policy
1.  Go to **Admin Panel** > **System Settings**.
2.  Update "Min Office Days" or "Max Home Days".
3.  Employees violating this policy will see a warning when submitting.
