package com.skytracker.app.data.model

import androidx.compose.ui.graphics.Color

enum class CelestialType {
    SUN, MOON, PLANET, ISS
}

data class CelestialBodyUI(
    val name: String,
    val altitude: Double,   // degrees above horizon (-90 to +90)
    val azimuth: Double,    // degrees clockwise from North (0-360)
    val color: Color,
    val type: CelestialType,
    val size: Float = 1f,   // relative size multiplier
    val isVisible: Boolean = altitude > 0.0
)

enum class Planet(
    val displayName: String,
    val color: Color,
    val dotSize: Float
) {
    MERCURY("Mercúrio", Color(0xFFB5B5B5), 6f),
    VENUS("Vênus",      Color(0xFFF5DEB3), 9f),
    MARS("Marte",       Color(0xFFE25822), 8f),
    JUPITER("Júpiter",  Color(0xFFE8C08A), 12f),
    SATURN("Saturno",   Color(0xFFD4A960), 11f);

    companion object {
        fun observablePlanets() = listOf(MERCURY, VENUS, MARS, JUPITER, SATURN)
    }
}

data class SkyObservingCondition(
    val rating: ObservingRating,
    val label: String,
    val description: String
)

enum class ObservingRating(val stars: Int, val color: Color) {
    EXCELLENT(5, Color(0xFF00C853)),
    GOOD(4, Color(0xFF64DD17)),
    FAIR(3, Color(0xFFFFD600)),
    POOR(2, Color(0xFFFF6D00)),
    BAD(1, Color(0xFFD50000))
}
