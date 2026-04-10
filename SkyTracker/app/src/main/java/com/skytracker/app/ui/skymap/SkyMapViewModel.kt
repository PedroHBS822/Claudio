package com.skytracker.app.ui.skymap

import androidx.compose.ui.graphics.Color
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.skytracker.app.data.model.CelestialBodyUI
import com.skytracker.app.data.model.CelestialType
import com.skytracker.app.data.model.Planet
import com.skytracker.app.util.AstronomyUtils
import com.skytracker.app.util.LocationHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject

data class SkyMapUiState(
    val celestialBodies: List<CelestialBodyUI> = emptyList(),
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val locationName: String = "",
    val localSiderealTime: Double = 0.0,
    val lastUpdateTime: String = "",
    val isLocationGranted: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: String? = null
)

@HiltViewModel
class SkyMapViewModel @Inject constructor(
    private val locationHelper: LocationHelper
) : ViewModel() {

    private val _uiState = MutableStateFlow(SkyMapUiState())
    val uiState: StateFlow<SkyMapUiState> = _uiState.asStateFlow()

    private val timeFmt = SimpleDateFormat("HH:mm:ss", Locale.getDefault())

    fun onLocationGranted() {
        _uiState.update { it.copy(isLocationGranted = true) }
        startUpdating()
    }

    private fun startUpdating() {
        viewModelScope.launch {
            while (true) {
                val location = locationHelper.getLastLocation()
                    ?: locationHelper.getCurrentLocation()

                if (location != null) {
                    updateSky(location.latitude, location.longitude)
                } else {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = "Não foi possível obter sua localização."
                        )
                    }
                }
                delay(60_000L)   // refresh every minute
            }
        }
    }

    private fun updateSky(lat: Double, lon: Double) {
        val now = Date()
        val jd  = AstronomyUtils.julianDate(now)
        val lst = AstronomyUtils.localSiderealTime(jd, lon)

        val bodies = mutableListOf<CelestialBodyUI>()

        // ── Sun ──────────────────────────────────────────────────────────────
        val sunEq = AstronomyUtils.sunPosition(jd)
        val sunHz = AstronomyUtils.equatorialToHorizontal(sunEq.ra, sunEq.dec, lst, lat)
        bodies += CelestialBodyUI(
            name = "Sol",
            altitude = sunHz.alt,
            azimuth  = sunHz.az,
            color    = Color(0xFFFDD835),
            type     = CelestialType.SUN,
            size     = 2.0f
        )

        // ── Moon ─────────────────────────────────────────────────────────────
        val moonEq = AstronomyUtils.moonPosition(jd)
        val moonHz = AstronomyUtils.equatorialToHorizontal(moonEq.ra, moonEq.dec, lst, lat)
        bodies += CelestialBodyUI(
            name = "Lua",
            altitude = moonHz.alt,
            azimuth  = moonHz.az,
            color    = Color(0xFFE0E0E0),
            type     = CelestialType.MOON,
            size     = 1.8f
        )

        // ── Planets ───────────────────────────────────────────────────────────
        Planet.observablePlanets().forEach { planet ->
            val eq = AstronomyUtils.planetPosition(planet, jd)
            val hz = AstronomyUtils.equatorialToHorizontal(eq.ra, eq.dec, lst, lat)
            bodies += CelestialBodyUI(
                name     = planet.displayName,
                altitude = hz.alt,
                azimuth  = hz.az,
                color    = planet.color,
                type     = CelestialType.PLANET,
                size     = planet.dotSize / 8f
            )
        }

        _uiState.update {
            it.copy(
                celestialBodies    = bodies,
                latitude           = lat,
                longitude          = lon,
                localSiderealTime  = lst,
                lastUpdateTime     = timeFmt.format(now),
                isLoading          = false,
                errorMessage       = null
            )
        }
    }

    /** Called from ISS screen to overlay ISS position on the sky map */
    fun updateISSPosition(lat: Double, lon: Double, issLat: Double, issLon: Double) {
        val now = Date()
        val jd  = AstronomyUtils.julianDate(now)
        val lst = AstronomyUtils.localSiderealTime(jd, lon)

        // Approximate ISS sky position based on its sub-satellite point
        // The ISS orbits at ~408 km altitude; we compute the viewing angle from observer
        val dLat = Math.toRadians(issLat - lat)
        val dLon = Math.toRadians(issLon - lon)
        val latRad = Math.toRadians(lat)
        val issLatRad = Math.toRadians(issLat)

        val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(latRad) * Math.cos(issLatRad) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
        val groundDist = 6371.0 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))  // km

        val issAlt = 408.0  // km
        val elevationRad = Math.atan2(issAlt, groundDist)
        val alt = Math.toDegrees(elevationRad)

        // Bearing from observer to ISS sub-point
        val y = Math.sin(dLon) * Math.cos(issLatRad)
        val x = Math.cos(latRad) * Math.sin(issLatRad) - Math.sin(latRad) * Math.cos(issLatRad) * Math.cos(dLon)
        val az = (Math.toDegrees(Math.atan2(y, x)) + 360.0) % 360.0

        val current = _uiState.value
        val bodies = current.celestialBodies.toMutableList()
        bodies.removeAll { it.type == CelestialType.ISS }

        if (alt > 5.0) {   // only show ISS if above 5° elevation
            bodies += CelestialBodyUI(
                name     = "ISS",
                altitude = alt,
                azimuth  = az,
                color    = Color(0xFF00E676),
                type     = CelestialType.ISS,
                size     = 1.4f
            )
        }

        _uiState.update { it.copy(celestialBodies = bodies) }
    }
}
