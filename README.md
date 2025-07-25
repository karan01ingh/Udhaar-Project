# 💸 Udhhar – Personal Lending Tracker

**Udhhar** is a full-stack web application that helps users (lenders) keep track of money they've lent to others. It allows lenders to manage borrowers, track amounts given and repaid, and monitor outstanding balances — all in one place.

> 📌 Built with a modern MERN stack and deployed on Render.

---

## 🧾 Udhhar – Core Functionalities Summary

### 🔐 Lender Registration & Authentication
- Secure signup and login for lenders
- JWT-based session management

### 👥 Add Borrowers
- Lenders can add borrowers with:
  - Name
  - Email (must be unique per lender)
  - Phone number
- Prevents duplicate borrower emails for the same lender

### 💰 Loan Tracking
- Record how much money a borrower has borrowed
- Track how much they have repaid
- Automatically calculate outstanding balances

### 📋 Borrower List Per Lender
- Each lender can view only their own list of borrowers
- Borrower data is filtered and secured by `lenderId`

### ✅ Validation & Error Handling
- Server-side validation for borrower entries
- Proper error messages (e.g., duplicate borrower warning)

### 🖥️ Clean and Responsive UI
- Built with modern frontend tools (React, Tailwind/Bootstrap)
- Optimized for mobile and desktop use

### 🚀 Deployed & Production-Ready
- Backend hosted on Render
- Frontend hosted on Netlify or Vercel
- Environment-based configuration using `.env`

---

## 🧪 Future Improvements

- 📊 Add a dashboard with charts and summaries
- 📱 Native mobile app with React Native or Flutter
- 📧 Email reminders for outstanding payments
- 🧾 Transaction history per borrower

---

## 🌐 Live Demo

- 🔗 Udhhar: [https://udhaar-project.vercel.app](#)

---

## 🧑‍💻 Author

**[Karan Singh Manral]**  
📫 [personalkaran2004@gmail.com](mailto:your.email@example.com)  
🔗 [LinkedIn Profile](https://www.linkedin.com/in/karan-singh-manral-04a0b1267/)

---

