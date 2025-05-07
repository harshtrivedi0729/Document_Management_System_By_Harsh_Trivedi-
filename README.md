# 📄 Document Management System (DMS)

A robust, lightweight Document Management System (DMS) built using **ReactJS (Material UI), NodeJS (ExpressJS/NestJS), AWS S3, and SQL** . 
This system allows users to **securely upload, retrieve, and delete documents**, with files stored on AWS S3 and metadata stored in an SQL database.

---

## 🧾 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshot](#screenshot)
---

## ✅ Features

### Frontend (ReactJS + Material UI)
- 📁 **Button-Based File Upload**
- 📝 **Display list of uploaded files**
- 👁️ **View file in browser**
- 🗑️ **Delete uploaded files**
- 📱 **Responsive Design** (Desktop + Mobile)

### Backend (NodeJS + ExpressJS/NestJS)
- 📤 API to upload files to AWS S3
- 📄 API to list all files in the S3 bucket
- ❌ API to delete files from AWS S3
- 🔒 Error handling, input validation, and logs

### Database
- 🗃️ SQL DB to store file metadata:
  - `filename`, `size`, `timestamp`, `s3_url`

### Integration
- ✅ AWS S3 SDK integrated in backend for secure file handling

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | ReactJS, Material UI          |
| Backend    | NodeJS, ExpressJS/NestJS      |
| Cloud      | AWS S3                        |
| Database   | PostgreSQL                    |
| Tools      | Postman, Git, VS Code         |

---

## 🏛 Architecture

```plaintext

[ ReactJS + MUI UI ]  -->  [ NodeJS / ExpressJS APIs ]  -->  [ AWS S3 (Storage) ]
                                 ⬇
                         [ SQL Database (Metadata) ]
```

## Screen-shot
<img width="1222" alt="DMS_by_Harsh_Trivedi" src="https://github.com/user-attachments/assets/1bb0b1c3-a22b-44fc-bd7a-504e65b8bf98" />

