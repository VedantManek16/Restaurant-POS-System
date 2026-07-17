# RestroDesk 🍽️

**Live URL**: [https://restrodesk-vhkk.onrender.com/](https://restrodesk-vhkk.onrender.com/)

RestroDesk is a modern, high-performance, and responsive multi-tenant **Restaurant Point of Sale (POS) & Billing System** built using the MERN stack (MongoDB, Express, React, Node.js). 

It is designed to handle multiple outlets (tenants) under a single management system. RestroDesk provides restaurant operators, admins, cashiers, and waiters with unified workflows to manage orders, dining tables, categories, dishes, payments, and real-time kitchen tracking.

---

## 🚀 Key Features

* **Multi-Tenant Architecture**: Supports multiple distinct restaurant accounts, isolation of orders, menus, table configurations, and outlet settings.
* **Real-Time KDS notifications**: Implements high-performance Server-Sent Events (SSE) to broadcast order placement (to KDS screens) and order ready alerts (to cashiers/waiters) instantly, paired with custom audio beeps.
* **Interactive Dashboard Analytics**: Features custom zero-dependency SVG charts showing today's hourly revenue trends and weekly analytics.
* **Billing & Static P2P QR Invoices**: Generates professional billing printouts and dynamically compiles static P2P UPI QR Codes (payee address and name preloaded) to guarantee banking app scan resolutions under NCPI regulations.
* **Outlet Customizations**: Allows outlet owners to customize settings like GST No, logo upload, UPI payment addresses, and UPI QR Code uploads.
* **Order & Card Pagination**: Limits active order views to structured grids (12 items per page) and card listings (5 items per page) to prevent vertical overflow and scrolling lag.
* **Role-Based Routing**: Restricts page access dynamically based on role profiles (Super Admin, Restaurant Admin, Cashier, Waiter, Kitchen Staff).
* **Automatic Cloudinary Storage**: Uploads restaurant logo images and food thumbnails to Cloudinary automatically with local fallback storage in MongoDB.

---

## 🛠️ Technology Stack

### Backend
* **Runtime**: Node.js & Express
* **Database**: MongoDB (Mongoose ODM)
* **Image Uploads**: Cloudinary Node SDK
* **Payments**: Razorpay SDK
* **Auth**: JSON Web Tokens (JWT) & HTTP-Only Cookies

### Frontend
* **Build System**: Vite & React 19
* **State Management**: Redux Toolkit (with Redux Persist)
* **Styling**: TailwindCSS
* **Icons**: Lucide Icons & React Icons
* **PDF Reports**: jsPDF

---

## 📂 Project Structure

```bash
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── assets/         # Static assets (images, fonts)
│   │   ├── components/     # UI Components (auth, billing, home, orders)
│   │   ├── constants/      # Centralized project constants
│   │   ├── pages/          # Page router entrypoints (Home, Orders, Staff, Settings)
│   │   ├── redux/          # Redux toolkit store and slices
│   │   └── utils/          # Formatting helpers, PDF generators, and API fetch wrapper
│   └── package.json
│
└── server/                 # Backend Node.js API
    ├── src/
    │   ├── config/         # Database and env key config loaders
    │   ├── controllers/    # API controllers (orders, menu, settings, reports)
    │   ├── middleware/     # Auth checks, error handling, role verification
    │   ├── models/         # MongoDB Schemas (user, order, table, settings)
    │   ├── routes/         # Express Router routes mapping
    │   └── utils/          # SSE Stream management and Cloudinary helper
    └── package.json
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/VedantManek16/Restaurant-POS-System.git
cd Restaurant-POS-System
```

### 2. Configure Backend Server
Create a `.env` file inside the `server` directory:
```env
PORT=8000
NODE_ENV=development
DB_URI=your_mongodb_connection_uri
ACCESS_TOKEN_SECRET=your_jwt_secret_token

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Config
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Install backend dependencies and start development server:
```bash
cd server
npm install
npm run dev
```

### 3. Configure Frontend Client
Create a `.env` file inside the `client` directory:
```env
VITE_API_URL=http://localhost:8000/api
```

Install frontend dependencies and start Vite dev environment:
```bash
cd ../client
npm install
npm run dev
```

---

## 🚀 Live Deployment Configuration

This repository is pre-configured and deployed live:
* **Live Application URL**: [https://restrodesk-vhkk.onrender.com/](https://restrodesk-vhkk.onrender.com/)
* **Frontend**: Hosted on Render (as a Static Site).
* **Backend**: Hosted on Render (as a Web Service).

For a comprehensive step-by-step roadmap, configuration parameters, and whitelisting checklists, please refer to the [Production Deployment Roadmap](C:/Users/vedan/.gemini/antigravity-ide/brain/19802d08-d2bc-4e2a-b2b6-aeba07e93fb4/deployment_roadmap.md) artifact.
