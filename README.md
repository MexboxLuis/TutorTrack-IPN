# Welcome to TutorTrack (PIT IPN) 🦉

Welcome to the **TutorTrack** repository. This is a native Android application engineered to modernize and streamline the Institutional Tutoring Program (Programa Institucional de Tutorías - PIT) at the Instituto Politécnico Nacional (IPN). 

It replaces manual attendance sheets and administrative bottlenecks with a centralized, real-time platform for tutors, students, and administrators.

---

## 📚 About The Project

| Feature                | Details |
| ---------------------- | ------- |
| 🎯 **Purpose**         | To digitize attendance tracking, schedule approvals, and automated reporting for peer tutoring sessions and academic advisories. |
| ⚙️ **Architecture**     | Built on a single-activity architecture utilizing 100% Jetpack Compose for a reactive, state-driven UI. |
| 🛡️ **Security & Policy**| Implements a custom `AppGuard` to enforce strict device policies (Automatic Network Time, UTC-6 Timezone) to prevent manual time manipulation during class check-ins. |
| 🔄 **Core Operations** | Role-based dashboards (Admin/Tutor), QR-based student check-ins, real-time schedule conflict resolution, and CSV report generation. |

---

## 🚀 Tech Stack

### Android & UI

![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-0095D5?style=for-the-badge&logo=kotlin&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-4285F4?style=for-the-badge&logo=android&logoColor=white)

- **Kotlin & Jetpack Compose:** Declarative UI toolkit used to build complex, responsive interfaces.
- **ZXing / JourneyApps:** QR scanning for student credentials.
- **Kotlin CSV:** Export attendance records locally.

### Backend & Cloud

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

- **Firebase Authentication**
- **Firebase Firestore**
- **Firebase Storage**

---

## 🔧 Highlighted Features

| Feature | Description |
|--------|------------|
| **Role-Based Access** | Admin and Tutor environments. |
| **Smart Scheduling** | Prevents overlapping schedules. |
| **QR Attendance Scanner** | Extracts student data instantly. |
| **Automated CSV Reports** | Generates downloadable reports. |
| **Dynamic Calendar System** | Handles non-working days. |

---

## 📸 Screenshots

- ![Admin Dashboard](assets/AdminDashboard.jpeg)
- ![Tutor Class & QR Scanner](assets/ClassScanner.jpeg)
- ![Schedule Creation](assets/Scheduling.jpeg)
- ![Statistics & Reports](assets/StatsAndReports.jpeg)

---

## 🛠️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/MexboxLuis/TutorTrack-IPN.git
cd TutorTrack-IPN
```

### 2. Open the project
Open with Android Studio.

### 3. Firebase Setup
- Create project
- Add Android app
- Add google-services.json
- Enable Firestore, Storage, Auth

### 4. Build and Run
Run from Android Studio.

---

## 💡 Final Notes

This repository showcases a production-ready internal tool with complex validation and real-world use.
