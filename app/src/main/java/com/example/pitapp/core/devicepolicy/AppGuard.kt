package com.example.pitapp.core.devicepolicy


import android.content.Intent
import android.provider.Settings
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.example.pitapp.ui.shared.screens.LoadingScreen
import com.example.pitapp.ui.shared.screens.NoInternetScreen
import com.example.pitapp.ui.shared.screens.TimePolicyScreen

/**
 * Cooldown en milisegundos entre re-validaciones automáticas del guard.
 * Evita que cada ON_RESUME (p.ej. al volver del scanner QR) dispare
 * revalidaciones innecesarias.  Los reintentos manuales (botón "Retry")
 * y los cambios explícitos de configuración de hora ignoran el cooldown.
 */
private const val GUARD_COOLDOWN_MS = 60_000L

@Composable
fun AppGuard(content: @Composable () -> Unit) {
    val ctx = LocalContext.current
    val cr = ctx.contentResolver
    val lifecycleOwner = LocalLifecycleOwner.current

    val isOnline by remember { networkFlow(ctx) }.collectAsState(initial = true)

    var policy by remember { mutableStateOf(currentTimePolicy(cr)) }
    var checking by remember { mutableStateOf(true) }
    var retryKey by remember { mutableIntStateOf(0) }

    // Timestamp de la última validación completa exitosa
    var lastCheckMs by remember { mutableLongStateOf(0L) }

    // Una vez que el guard pasó al menos una vez, no bloqueamos por
    // pérdida de internet a mitad de sesión (Firestore cachea offline).
    var passedOnce by remember { mutableStateOf(false) }


    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                val now = System.currentTimeMillis()
                // Solo re-validar si pasó el cooldown desde la última comprobación.
                // Esto evita que volver del QR scanner re-dispare toda la lógica.
                if (now - lastCheckMs > GUARD_COOLDOWN_MS) {
                    retryKey++
                }
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    LaunchedEffect(Unit) {
        timeConfigChangesFlow(ctx).collect {
            // Cambios explícitos de zona/hora siempre re-validan (sin cooldown).
            retryKey++
        }
    }

    LaunchedEffect(isOnline, retryKey) {
        policy = currentTimePolicy(cr)
        checking = true
        if (policy.isCompliant) {
            lastCheckMs = System.currentTimeMillis()
            passedOnce = true
        }
        checking = false
    }

    when {
        checking -> LoadingScreen()

        !policy.isCompliant -> {
            TimePolicyScreen(
                policy = policy,
                onOpenSettings = { ctx.startActivity(Intent(Settings.ACTION_DATE_SETTINGS)) },
                onRetry = { retryKey++ }
            )
        }

        // Si ya pasó el guard al menos una vez, no bloquear por falta de internet
        // a mitad de sesión; Firestore cachea escrituras offline.
        !isOnline && !passedOnce -> {
            NoInternetScreen(onRetry = { retryKey++ })
        }

        else -> content()
    }
}