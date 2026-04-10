package com.skytracker.app.ui.iss

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.maps.model.LatLng
import com.skytracker.app.data.model.ISSPass
import com.skytracker.app.data.repository.ISSRepository
import com.skytracker.app.data.repository.ISSResult
import com.skytracker.app.util.LocationHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject

data class ISSUiState(
    val issPosition: LatLng? = null,
    val issLatitude: Double = 0.0,
    val issLongitude: Double = 0.0,
    val issVelocityKmh: Double = 27600.0,    // ISS typical orbital velocity ~27,600 km/h
    val issAltitudeKm: Double = 408.0,
    val userLatitude: Double = 0.0,
    val userLongitude: Double = 0.0,
    val distanceFromUserKm: Double? = null,
    val isOverhead: Boolean = false,
    val lastUpdateTime: String = "",
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val isLocationGranted: Boolean = false,
    val groundTrack: List<LatLng> = emptyList()
)

@HiltViewModel
class ISSTrackerViewModel @Inject constructor(
    private val issRepository: ISSRepository,
    private val locationHelper: LocationHelper
) : ViewModel() {

    private val _uiState = MutableStateFlow(ISSUiState())
    val uiState: StateFlow<ISSUiState> = _uiState.asStateFlow()

    private val timeFmt = SimpleDateFormat("HH:mm:ss", Locale.getDefault())

    fun onLocationGranted() {
        _uiState.update { it.copy(isLocationGranted = true) }
        startTracking()
    }

    private fun startTracking() {
        viewModelScope.launch {
            // Get user location once
            val location = locationHelper.getLastLocation() ?: locationHelper.getCurrentLocation()
            if (location != null) {
                _uiState.update {
                    it.copy(
                        userLatitude = location.latitude,
                        userLongitude = location.longitude
                    )
                }
            }
        }

        // Poll ISS position every 5 seconds
        viewModelScope.launch {
            issRepository.getISSPositionStream().collect { result ->
                when (result) {
                    is ISSResult.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                    is ISSResult.Success -> {
                        val issLat = result.data.issPosition.latitudeDouble()
                        val issLon = result.data.issPosition.longitudeDouble()

                        val state = _uiState.value
                        val dist = if (state.userLatitude != 0.0 || state.userLongitude != 0.0) {
                            locationHelper.distanceKm(
                                state.userLatitude, state.userLongitude,
                                issLat, issLon
                            )
                        } else null

                        // ISS is roughly "overhead" if ground distance < 2000 km
                        // (visible horizon at ISS altitude ~408km is ~2200km radius)
                        val isOverhead = dist != null && dist < 2200.0

                        // Build ground track: show past and next 15 positions
                        // (simplified: just current point for now, full track needs TLE)
                        val track = buildGroundTrack(issLat, issLon)

                        _uiState.update {
                            it.copy(
                                issPosition = LatLng(issLat, issLon),
                                issLatitude = issLat,
                                issLongitude = issLon,
                                distanceFromUserKm = dist,
                                isOverhead = isOverhead,
                                lastUpdateTime = timeFmt.format(Date(result.data.timestamp * 1000L)),
                                isLoading = false,
                                errorMessage = null,
                                groundTrack = track
                            )
                        }
                    }
                    is ISSResult.Error -> {
                        _uiState.update {
                            it.copy(
                                isLoading = false,
                                errorMessage = result.message
                            )
                        }
                    }
                }
            }
        }
    }

    /**
     * Builds a simplified ground track by estimating the ISS orbit direction.
     * The ISS has an orbital period of ~92 minutes and a 51.6° inclination.
     * This approximation propagates the position forward/backward assuming
     * the ISS moves westward ~22.5° per orbit relative to Earth.
     */
    private fun buildGroundTrack(lat: Double, lon: Double): List<LatLng> {
        // Orbital velocity: ~7.66 km/s → ~0.0647°/s of Earth surface arc
        // Over 15 minutes each direction: 58° arc
        val track = mutableListOf<LatLng>()
        val step = 2.0  // degrees of longitude per step (simplified)
        val steps = 15

        for (i in -steps..steps) {
            val trackLon = ((lon + i * step) + 540) % 360 - 180
            // Simplified: use current lat (not accurate, just for visualization)
            val trackLat = lat + i * 0.8  // small inclination-based drift
            if (trackLat in -90.0..90.0) {
                track.add(LatLng(trackLat.coerceIn(-90.0, 90.0), trackLon))
            }
        }
        return track
    }
}
