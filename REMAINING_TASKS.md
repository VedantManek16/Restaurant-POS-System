# Restaurant-POS Remaining Integration Tasks & Fixes

This checklist outlines the remaining mock elements, unconnected pages, and architectural adjustments required to make the entire `Restaurant-POS` application fully functional from end to end.

---

## 📋 High-Level Action Checklist

### 1. Seating & Order Flow (Completed ✅)
* [x] **Table Models**: Migrated physical table schemas using ESM Mongoose.
* [x] **Table Check-in**: Connect table maps to read live database entries.
* [x] **Order Database Log**: Save placed carts to `orders` collection.
* [x] **Seating Automation**: Mark table status as `Booked` and link active order ID on checkout.
* [x] **Unique Index Indexing**: Fixed the duplicate key check on `orderId` index.

---

### 2. User & Staff Directory (`Staff.jsx` Completed ✅)
* **Current State**: Staff list registers additions and deletions via database queries.
* **Backend Completed**:
  1. Added an Express controller handler `getTenantStaff` in `userController.js` to find all employees associated with the Admin's `tenantId`.
  2. Registered `GET /api/user/staff` endpoint in `userRoute.js` with `isVerifiedUser` token validation.
  3. Created a delete route `DELETE /api/user/staff/:id` to allow admins to terminate accounts.
* **Frontend Completed**:
  1. Replaced `MOCK_STAFF` with `useEffect` loading from `/api/user/staff`.
  2. Connected "Create User" submit to execute a POST request to `/api/user/register`.
  3. Connected the delete button action to trigger the `/api/user/staff/:id` deletion.

---

### 3. Store Configurations & Taxes (`Settings.jsx` Completed ✅)
* **Current State**: Settings configurations persist inside the database collection. Checkout calculations fetch configurations dynamically.
* **Backend Completed**:
  1. Created a `settingsModel.js` collection storing fields like `restaurantName`, `address`, `taxRate` (GST), `serviceCharge`, and `receiptFooter`.
  2. Implemented `GET /api/settings` and `PUT /api/settings` controller endpoints to load and overwrite settings configurations.
* **Frontend Completed**:
  1. Bound input form fields in `Settings.jsx` to load default configurations from `/api/settings` and update them on form submit.
  2. Refactored the billing calculator in **[Bill.jsx](file:///d:/Full%20Stack%20Projects/Restaurant-POS/client/src/components/menu/Bill.jsx)** to fetch `taxRate` from settings dynamically rather than hardcoding `5.25%`.

---

### 4. Sales Metrics & Analytics (`Reports.jsx` & `Home.jsx` Completed ✅)
* **Current State**: Revenue summaries, transaction counters, average ticket sizes, and in-progress order counts are aggregated from live database documents.
* **Backend Completed**:
  1. Created a reports aggregator endpoint `/api/reports/analytics` that runs aggregate queries on the `orders` collection.
* **Frontend Completed**:
  1. Updated `Reports.jsx` to load dynamic sums from the aggregation endpoints.
  2. Updated the dashboard view (**[Home.jsx](file:///d:/Full%20Stack%20Projects/Restaurant-POS/client/src/pages/Home.jsx)**) to read live net sales sums instead of showing hardcoded dashboard stats.
