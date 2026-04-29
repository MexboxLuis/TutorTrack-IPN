// ============================================================
// 🌱 Seed Script para TutorTrack PIT-IPN
// ============================================================
// Este script pre-carga datos realistas en Firestore para el demo.
//
// USO:
//   1. Descarga tu Service Account Key de Firebase Console:
//      Firebase Console → ⚙️ → Project Settings → Service Accounts → Generate New Private Key
//   2. Guarda el archivo JSON como `serviceAccountKey.json` en esta misma carpeta (seed/)
//   3. Ejecuta: npm install && npm run seed
//
// ⚠️  IMPORTANTE: El archivo serviceAccountKey.json contiene credenciales sensibles.
//     Ya está incluido en .gitignore, NUNCA lo subas a un repositorio.
// ============================================================

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// --- Configuración ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (e) {
  console.error('\n❌ No se encontró el archivo serviceAccountKey.json');
  console.error('   Descárgalo desde Firebase Console:');
  console.error('   ⚙️ → Project Settings → Service Accounts → Generate New Private Key');
  console.error(`   Guárdalo en: ${serviceAccountPath}\n`);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ============================================================
// 📦 DATOS SEED
// ============================================================

// --- Salones (saved_classrooms) ---
// document ID = number.toString()
const classrooms = [
  { number: 1101, description: 'Aula teórica - Edificio 1, Piso 1' },
  { number: 1203, description: 'Aula teórica - Edificio 1, Piso 2' },
  { number: 2102, description: 'Laboratorio de Cómputo 1 - Edificio 2' },
  { number: 2205, description: 'Laboratorio de Redes - Edificio 2' },
  { number: 3101, description: 'Sala de Tutorías - Edificio 3' },
];

// --- Calendario (saved_calendar) ---
// Estructura: saved_calendar/{year}/nonWorkingDays/{autoId}  → { date: Timestamp }
//             saved_calendar/{year}/periods/{autoId}         → { startDate: Timestamp, endDate: Timestamp }

// Helper: crear un Timestamp de Firestore a partir de una fecha en timezone Mexico City
function toTimestamp(year, month, day) {
  // Meses en JS son 0-indexed
  const date = new Date(Date.UTC(year, month - 1, day, 6, 0, 0)); // UTC-6 ≈ medianoche CDMX
  return Timestamp.fromDate(date);
}

const year = '2026'; // Ajusta al año actual de tu demo

const nonWorkingDays = [
  { date: toTimestamp(2026, 5, 1) },   // Día del Trabajo
  { date: toTimestamp(2026, 5, 5) },   // Batalla de Puebla
  { date: toTimestamp(2026, 5, 21) },  // Día del Politécnico
];

const periods = [
  {
    startDate: toTimestamp(2026, 5, 18),
    endDate: toTimestamp(2026, 5, 29),
  }, // Periodo de exámenes parciales
];

// --- Tutor pre-existente (saved_users) ---
// Este tutor ya aprobado (permission=1) le da vida al dashboard del admin.
// ⚠️ IMPORTANTE: Este email debe coincidir con una cuenta que ya hayas
//    creado en Firebase Authentication. Si no, créala manualmente en
//    Firebase Console → Authentication → Add User.
//
// 🔧 PERSONALIZA ESTOS DATOS antes de ejecutar:
const preExistingTutor = {
  email: 'tutor.demo@student.ipn.mx',
  name: 'María Fernanda',
  surname: 'González Reyes',
  permission: 1,                         // 1 = tutor aprobado
  profilePictureUrl: null,
  academicProgram: 'Ingeniería en Inteligencia Artificial',
  studentId: '2023630001',               // Con boleta → aparece en "Tutoría entre pares"
  phoneNumber: '5512345678',
};

// --- Admin (saved_users) ---
const adminUser = {
  email: 'admin@ipn.mx',
  name: 'Administrador',
  surname: 'PIT UPIIT',
  permission: 2,                         // 2 = admin
  profilePictureUrl: null,
  academicProgram: null,
  studentId: null,
  phoneNumber: null,
};

// --- Horario pre-aprobado para el tutor existente (saved_schedules) ---
// Esto hace que cuando entres como admin ya veas un tutor con horario activo.
const preExistingSchedule = {
  classroomId: '3101',                   // Debe coincidir con un salón de arriba
  tutorEmail: preExistingTutor.email,
  subject: 'Cálculo Diferencial',
  approved: true,
  startYear: 2026,
  startMonth: 2,                         // Febrero
  endYear: 2026,
  endMonth: 6,                           // Junio
  sessions: [
    { dayOfWeek: 2, startTime: 10 },     // Lunes 10:00   (Calendar.MONDAY = 2)
    { dayOfWeek: 4, startTime: 10 },     // Miércoles 10:00
  ],
};

// --- Clases pasadas para el tutor (saved_instant_classes) ---
// Esto le da historial al tutor para que el dashboard no se vea vacío.
// document ID = `${tutorEmail}-${uuid}`

const pastClasses = [
  {
    tutorEmail: preExistingTutor.email,
    subject: 'Cálculo Diferencial',
    classroom: '3101',
    topic: 'Límites y continuidad',
    date: toTimestamp(2026, 4, 7),       // 7 abril
  },
  {
    tutorEmail: preExistingTutor.email,
    subject: 'Cálculo Diferencial',
    classroom: '3101',
    topic: 'Derivadas de funciones algebraicas',
    date: toTimestamp(2026, 4, 9),       // 9 abril
  },
  {
    tutorEmail: preExistingTutor.email,
    subject: 'Cálculo Diferencial',
    classroom: '3101',
    topic: 'Regla de la cadena y derivadas implícitas',
    date: toTimestamp(2026, 4, 14),      // 14 abril
  },
  {
    tutorEmail: preExistingTutor.email,
    subject: 'Cálculo Diferencial',
    classroom: '3101',
    topic: 'Aplicaciones de la derivada: máximos y mínimos',
    date: toTimestamp(2026, 4, 21),      // 21 abril
  },
];

// --- Alumnos dummy (boleta formato: 2024710XXX, 10 dígitos) ---
const dummyStudents = [
  {
    name: 'Carlos Eduardo Ramírez Soto',
    studentId: '2024710001',
    academicProgram: 'Ingeniería en Inteligencia Artificial',
    email: 'cramirez@alumno.ipn.mx',
    regular: true,
    signature: '',
  },
  {
    name: 'Ana Sofía Martínez López',
    studentId: '2024710002',
    academicProgram: 'Ingeniería en Inteligencia Artificial',
    email: 'amartinez@alumno.ipn.mx',
    regular: true,
    signature: '',
  },
  {
    name: 'Diego Alejandro Torres Vega',
    studentId: '2024710003',
    academicProgram: 'Licenciatura en Ciencia de Datos',
    email: 'dtorres@alumno.ipn.mx',
    regular: true,
    signature: '',
  },
  {
    name: 'Valentina Hernández Cruz',
    studentId: '2024710004',
    academicProgram: 'Ingeniería Biotecnológica',
    email: 'vhernandez@alumno.ipn.mx',
    regular: false,
    signature: '',
  },
  {
    name: 'José Miguel Flores Ruiz',
    studentId: '2024710005',
    academicProgram: 'Ingeniería en Sistemas Automotrices',
    email: 'jflores@alumno.ipn.mx',
    regular: true,
    signature: '',
  },
];

// Qué alumnos asistieron a cada clase (índices del array dummyStudents)
const classAttendance = [
  [0, 1, 2, 3, 4],   // Clase 1: todos (5)
  [0, 1, 2, 4],       // Clase 2: 4 alumnos
  [0, 1, 2, 3],       // Clase 3: 4 alumnos
  [0, 1, 2, 3, 4],   // Clase 4: todos (5)
];

// ============================================================
// 🚀 INSERCIÓN
// ============================================================

async function seedClassrooms() {
  console.log('📦 Insertando salones...');
  const batch = db.batch();
  for (const classroom of classrooms) {
    const docRef = db.collection('saved_classrooms').doc(classroom.number.toString());
    batch.set(docRef, classroom);
  }
  await batch.commit();
  console.log(`   ✅ ${classrooms.length} salones insertados`);
}

async function seedCalendar() {
  console.log('📅 Insertando calendario...');

  // Crear el documento del año (puede estar vacío, Firestore lo necesita como parent)
  const yearDoc = db.collection('saved_calendar').doc(year);
  await yearDoc.set({}, { merge: true });

  // Non-working days
  const nwdBatch = db.batch();
  for (const nwd of nonWorkingDays) {
    const docRef = yearDoc.collection('nonWorkingDays').doc();
    nwdBatch.set(docRef, nwd);
  }
  await nwdBatch.commit();
  console.log(`   ✅ ${nonWorkingDays.length} días no laborables insertados`);

  // Periods
  const periodBatch = db.batch();
  for (const period of periods) {
    const docRef = yearDoc.collection('periods').doc();
    periodBatch.set(docRef, period);
  }
  await periodBatch.commit();
  console.log(`   ✅ ${periods.length} periodos insertados`);
}

async function seedUsers() {
  console.log('👤 Insertando usuarios...');

  // Admin
  const adminRef = db.collection('saved_users').doc(adminUser.email);
  await adminRef.set(adminUser);
  console.log(`   ✅ Admin "${adminUser.name} ${adminUser.surname}" insertado (${adminUser.email})`);

  // Tutor
  const tutorRef = db.collection('saved_users').doc(preExistingTutor.email);
  await tutorRef.set(preExistingTutor);
  console.log(`   ✅ Tutor "${preExistingTutor.name} ${preExistingTutor.surname}" insertado (${preExistingTutor.email})`);
}

async function seedSchedule() {
  console.log('📋 Insertando horario pre-aprobado...');
  const docRef = db.collection('saved_schedules').doc();
  await docRef.set(preExistingSchedule);
  console.log(`   ✅ Horario de "${preExistingSchedule.subject}" insertado (aprobado)`);
}

async function seedClasses() {
  console.log('📚 Insertando clases pasadas con alumnos...');

  // Seed saved_students (catálogo global de alumnos)
  const studentBatch = db.batch();
  for (const student of dummyStudents) {
    const docRef = db.collection('saved_students').doc(student.studentId);
    studentBatch.set(docRef, student);
  }
  await studentBatch.commit();
  console.log(`   ✅ ${dummyStudents.length} alumnos insertados en catálogo global`);

  // Seed cada clase con su subcollección de students
  for (let i = 0; i < pastClasses.length; i++) {
    const cls = pastClasses[i];
    const classId = `${cls.tutorEmail}-class-seed-${String(i + 1).padStart(3, '0')}`;
    const classRef = db.collection('saved_instant_classes').doc(classId);
    await classRef.set(cls);

    // Agregar alumnos que asistieron a esta clase
    const attendees = classAttendance[i];
    const studentsBatch = db.batch();
    for (const studentIdx of attendees) {
      const student = dummyStudents[studentIdx];
      const studentDocRef = classRef.collection('students').doc();
      studentsBatch.set(studentDocRef, student);
    }
    await studentsBatch.commit();

    console.log(`   ✅ Clase "${cls.topic}" — ${attendees.length} alumnos`);
  }
}

async function main() {
  console.log('\n🌱 ====================================');
  console.log('   TutorTrack PIT-IPN — Seed Script');
  console.log('   ====================================\n');

  try {
    await seedClassrooms();
    await seedCalendar();
    await seedUsers();
    await seedSchedule();
    await seedClasses();

    console.log('\n🎉 ¡Datos seed insertados exitosamente!');
    console.log('\n📝 Recuerda:');
    console.log(`   1. El email del admin es: ${adminUser.email} — debe existir en Firebase Auth`);
    console.log(`   2. El email del tutor es: ${preExistingTutor.email} — debe existir en Firebase Auth`);
    console.log('   3. Si alguno NO existe en Auth, créalo en Firebase Console → Authentication → Add User');
    console.log('   4. Prepara un email NUEVO para registrar un tutor en vivo durante el demo\n');
  } catch (error) {
    console.error('\n❌ Error durante la inserción:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
