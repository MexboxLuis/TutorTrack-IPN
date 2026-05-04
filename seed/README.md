# Seed Scripts — TutorTrack PIT-IPN

Scripts to populate a clean Firestore database with realistic test data.

## Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled
- A **Service Account Key** (JSON) for that project

## Setup

### 1. Get your Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. **Project Settings** → **Service accounts** tab
3. Click **"Generate new private key"**
4. Save the downloaded file as `serviceAccountKey.json` in this directory

> ⚠️ **Never commit `serviceAccountKey.json` to version control.** It is already in `.gitignore`.

### 2. Install dependencies

```bash
cd seed
npm install
```

### 3. Create Firebase Auth users

The seed script only writes to **Firestore**. You must manually create the following users in **Firebase Authentication** → **Add User**:

| Email | Role | Password |
| --- | --- | --- |
| `admin@ipn.mx` | Admin | (your choice) |
| `tutor.demo@student.ipn.mx` | Pre-existing tutor | (your choice) |

## Usage

```bash
# Clean all Firestore data
npm run clean

# Insert seed data
npm run seed

# Full reset (clean + seed)
npm run clean && npm run seed
```

## What gets inserted

| Collection | Data |
| --- | --- |
| `saved_classrooms` | 5 classrooms (1101, 1203, 2100, 2102, 3101) |
| `saved_calendar` | Academic calendar with non-working days and one period |
| `saved_users` | Admin + 1 pre-approved tutor (María Fernanda) |
| `saved_schedules` | 1 approved schedule (Cálculo Diferencial) |
| `saved_instant_classes` | 4 past classes with real topics |
| `saved_students` | 5 students with IPN-format IDs (2024710001–2024710005) |

## Customization

- Edit `seed.mjs` to change the tutor email, subjects, students, or classroom configuration.
- The tutor has `studentId` set, so it appears under **"Tutoría entre pares"** (Peer Tutoring) in the admin view. Remove `studentId` to classify as **"Asesorías"** (Advisories) instead.
