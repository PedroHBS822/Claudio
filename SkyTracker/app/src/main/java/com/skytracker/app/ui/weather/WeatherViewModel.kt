package com.skytracker.app.ui.weather

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.skytracker.app.data.model.ForecastItem
import com.skytracker.app.data.model.SkyObservingCondition
import com.skytracker.app.data.model.WeatherResponse
import com.skytracker.app.data.repository.WeatherRepository
import com.skytracker.app.data.repository.WeatherResult
import com.skytracker.app.util.LocationHelper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class WeatherUiState(
    val currentWeather: WeatherResponse? = null,
    val forecast: List<ForecastItem> = emptyList(),
    val observingCondition: SkyObservingCondition? = null,
    val cityName: String = "",
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val isLocationGranted: Boolean = false
)

@HiltViewModel
class WeatherViewModel @Inject constructor(
    private val weatherRepository: WeatherRepository,
    private val locationHelper: LocationHelper
) : ViewModel() {

    private val _uiState = MutableStateFlow(WeatherUiState())
    val uiState: StateFlow<WeatherUiState> = _uiState.asStateFlow()

    fun onLocationGranted() {
        _uiState.update { it.copy(isLocationGranted = true) }
        loadWeather()
    }

    fun retry() = loadWeather()

    private fun loadWeather() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }

            val location = locationHelper.getLastLocation() ?: locationHelper.getCurrentLocation()
            if (location == null) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = "Não foi possível obter sua localização."
                    )
                }
                return@launch
            }

            val lat = location.latitude
            val lon = location.longitude

            // Fetch weather and forecast in parallel
            val weatherResult = weatherRepository.getCurrentWeather(lat, lon)
            val forecastResult = weatherRepository.getForecast(lat, lon)

            when (weatherResult) {
                is WeatherResult.Success -> {
                    val condition = weatherRepository.calculateObservingCondition(weatherResult.data)
                    val forecast = when (forecastResult) {
                        is WeatherResult.Success -> forecastResult.data.list
                        else -> emptyList()
                    }
                    _uiState.update {
                        it.copy(
                            currentWeather = weatherResult.data,
                            forecast = forecast,
                            observingCondition = condition,
                            cityName = weatherResult.data.cityName,
                            isLoading = false,
                            errorMessage = null
                        )
                    }
                }
                is WeatherResult.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = weatherResult.message
                        )
                    }
                }
                WeatherResult.Loading -> Unit
            }
        }
    }
}
