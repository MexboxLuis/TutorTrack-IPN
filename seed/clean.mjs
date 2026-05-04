// ============================================================
// 🧹 Clean Script para TutorTrack PIT-IPN
// ============================================================
// Elimina TODAS las colecciones de Firestore para empezar limpio.
//
// USO: npm run clean
//
// ⚠️  CUIDADO: Esto borra TODOS los datos. Úsalo solo antes del demo.
// ============================================================

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (e) {
  console.error('\n❌ No se encontró el archivo serviceAccountKey.json');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ============================================================
// Funciones de limpieza
// ============================================================

async function deleteCollection(collectionPath, batchSize = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  let totalDeleted = 0;

  while (true) {
    const snapshot = await query.get();
    if (snapshot.size === 0) break;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    totalDeleted += snapshot.size;

    if (snapshot.size < batchSize) break;
  }

  return totalDeleted;
}

async function deleteCalendarSubcollections() {
  // El calendario tiene subcollecciones por año
  const yearsSnapshot = await db.collection('saved_calendar').get();
  let totalNwd = 0;
  let totalPeriods = 0;

  for (const yearDoc of yearsSnapshot.docs) {
    const year = yearDoc.id;
    totalNwd += await deleteCollection(`saved_calendar/${year}/nonWorkingDays`);
    totalPeriods += await deleteCollection(`saved_calendar/${year}/periods`);
  }

  // Borrar los documentos de año
  const batch = db.batch();
  yearsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  if (yearsSnapshot.docs.length > 0) await batch.commit();

  return { totalNwd, totalPeriods, years: yearsSnapshot.docs.length };
}

async function deleteInstantClassesWithStudents() {
  const classesSnapshot = await db.collection('saved_instant_classes').get();
  let totalStudents = 0;

  for (const classDoc of classesSnapshot.docs) {
    totalStudents += await deleteCollection(
      `saved_instant_classes/${classDoc.id}/students`
    );
  }

  const totalClasses = await deleteCollection('saved_instant_classes');
  return { totalClasses, totalStudents };
}

async function main() {
  console.log('\n🧹 ====================================');
  console.log('   TutorTrack PIT-IPN — Clean Script');
  console.log('   ====================================\n');

  console.log('⚠️  Esto eliminará TODOS los datos de Firestore.\n');

  try {
    // 1. Salones
    const classrooms = await deleteCollection('saved_classrooms');
    console.log(`🗑️  saved_classrooms: ${classrooms} documentos eliminados`);

    // 2. Calendario (con subcollecciones)
    const cal = await deleteCalendarSubcollections();
    console.log(`🗑️  saved_calendar: ${cal.years} años, ${cal.totalNwd} días no laborables, ${cal.totalPeriods} periodos eliminados`);

    // 3. Usuarios
    const users = await deleteCollection('saved_users');
    console.log(`🗑️  saved_users: ${users} documentos eliminados`);

    // 4. Horarios
    const schedules = await deleteCollection('saved_schedules');
    console.log(`🗑️  saved_schedules: ${schedules} documentos eliminados`);

    // 5. Clases instantáneas (con subcollección de students)
    const classes = await deleteInstantClassesWithStudents();
    console.log(`🗑️  saved_instant_classes: ${classes.totalClasses} clases, ${classes.totalStudents} estudiantes eliminados`);

    // 6. Estudiantes guardados
    const students = await deleteCollection('saved_students');
    console.log(`🗑️  saved_students: ${students} documentos eliminados`);

    console.log('\n✅ ¡Base de datos limpia!');
    console.log('   Ahora ejecuta: npm run seed\n');
  } catch (error) {
    console.error('\n❌ Error durante la limpieza:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
