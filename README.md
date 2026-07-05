# 🗳️ VoteX - Secure Online Voting System

> A secure, scalable, and role-based online voting platform built using the MERN Stack.
> Secure online voting system with real-time vote management and user authentication.

![License](https://img.shields.io/badge/License-MIT-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-success)
![Express.js](https://img.shields.io/badge/Express.js-Framework-lightgrey)

---

## 📖 Overview

**VoteX** is a full-stack online voting platform designed to modernize the election process by replacing traditional paper-based voting with a secure digital solution.

The platform provides dedicated portals for **Administrators**, **Candidates**, and **Voters**, ensuring transparent election management while maintaining vote integrity and security.

The system incorporates authentication, authorization, secure password encryption, and one-person-one-vote validation to deliver a reliable online election experience.

---

# ✨ Features

### 👤 Authentication
- Secure User Registration
- Login Authentication
- JWT-based Authorization
- Password Encryption using Bcrypt
- OTP Verification

### 🗳️ Election Management
- Create Elections
- Start & End Elections
- Candidate Approval
- Election Scheduling
- Constituency-Based Candidate Listing

### 👥 Role-Based Access Control

#### Admin
- Manage Users
- Approve Candidates
- Create Elections
- Monitor Voting
- Publish Results

#### Candidate
- Register
- View Election Status
- Participate in Elections

#### Voter
- Register
- Login Securely
- View Candidates
- Cast Vote
- View Results

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using Bcrypt
- One Person One Vote Validation
- Protected REST APIs
- Role-Based Authorization
- Secure Database Storage
- Duplicate Vote Prevention

---

# 🏗️ System Architecture

```
                React Frontend
                      │
             REST API Requests
                      │
        Express.js + Node.js Backend
                      │
             JWT Authentication
                      │
                 MongoDB Database
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- HTML5
- CSS3
- JavaScript

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## Authentication

- JWT
- Bcrypt
- OTP Verification

## Other Tools

- REST APIs
- Git
- GitHub
- VS Code
- Postman

---

# 📂 Project Structure

```
VOTEx/
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── package.json
│
├── screenshots/
│
├── README.md
└── .gitignore
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Parvathyvinodkumar/VoteX.git
```

Move into project

```bash
cd VoteX
```

---

## Install Frontend

```bash
cd client
npm install
```

---

## Install Backend

```bash
cd ../server
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the server folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_password
```

---

## Run Backend

```bash
npm start
```

---

## Run Frontend

```bash
npm start
```

---

# 💻 Screenshots

Add screenshots here.

```
screenshots/

├── Login.png
├── Dashboard.png
├── Voting.png
├── Results.png
```

---

# 📊 Modules

### Admin Module

- Dashboard
- Candidate Approval
- Election Creation
- User Management
- Result Publication

---

### Candidate Module

- Registration
- Profile
- Election Participation

---

### Voter Module

- Registration
- Authentication
- Candidate List
- Vote Casting
- Results

---

# 📈 Advantages

- Transparent Elections
- Secure Authentication
- Fast Vote Counting
- Digital Result Generation
- Easy Election Management
- Responsive Interface
- Scalable Architecture

---

# ⚠️ Limitations

- Internet Connectivity Required
- Cloud Deployment Needed for Large Scale Elections
- Requires Secure Server Infrastructure

---

# 🔮 Future Scope

- Blockchain Integration
- Machine Learning for Fraud Detection
- Biometric Authentication
- Mobile Application
- Government Database Integration
- Face Recognition
- Geo-location Based Verification
- Real-Time Election Analytics

---

# 📚 Academic Purpose

This project was developed as a **Full Stack Web Development (MERN Stack)** academic project to demonstrate:

- Frontend Development
- Backend API Development
- Database Design
- Authentication & Authorization
- Full Stack Integration
- Secure Web Application Development

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👩‍💻 Author

**Parvathy V**

GitHub:
**https://github.com/Parvathyvinodkumar**

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

---

## Thank You ❤️
