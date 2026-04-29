package com.example.pitapp.core.devicepolicy

import android.content.ContentResolver
import android.provider.Settings
import java.util.TimeZone

data class TimePolicyState(
    val autoTimeEnabled: Boolean,
    val isValidMexicoZone: Boolean
) {
    val isCompliant: Boolean
        get() = autoTimeEnabled && isValidMexicoZone
}

private fun readAutoTime(cr: ContentResolver): Boolean =
    Settings.Global.getInt(cr, Settings.Global.AUTO_TIME, 0) == 1

fun currentTimePolicy(cr: ContentResolver): TimePolicyState {
    val autoTime = readAutoTime(cr)
    val tz = TimeZone.getDefault()
    val isValidZone = tz.id in VALID_ZONE_IDS

    return TimePolicyState(
        autoTimeEnabled = autoTime,
        isValidMexicoZone = isValidZone
    )
}

