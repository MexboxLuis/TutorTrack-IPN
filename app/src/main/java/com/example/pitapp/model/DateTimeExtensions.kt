package com.example.pitapp.model

import android.annotation.SuppressLint
import com.example.pitapp.core.devicepolicy.canonicalZoneId
import com.google.firebase.Timestamp
import java.time.LocalDate

@SuppressLint("NewApi")
fun LocalDate.toTimestampStartOfDay(): Timestamp {
    val instant = this.atStartOfDay(canonicalZoneId()).toInstant()
    return Timestamp(instant.epochSecond, 0)
}

@SuppressLint("NewApi")
fun NonWorkingDay.getLocalDate(): LocalDate =
    this.date.toDate().toInstant().atZone(canonicalZoneId()).toLocalDate()

@SuppressLint("NewApi")
fun Period.getStartLocalDate(): LocalDate =
    this.startDate.toDate().toInstant().atZone(canonicalZoneId()).toLocalDate()

@SuppressLint("NewApi")
fun Period.getEndLocalDate(): LocalDate =
    this.endDate.toDate().toInstant().atZone(canonicalZoneId()).toLocalDate()