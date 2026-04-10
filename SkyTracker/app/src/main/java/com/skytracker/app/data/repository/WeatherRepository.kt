package com.skytracker.app.data.repository

import com.skytracker.app.BuildConfig
import com.skytracker.app.data.api.WeatherApiService
import com.skytracker.app.data.model.ForecastResponse
import com.skytracker.app.data.model.ObservingRating
import com.skytracker.app.data.model.SkyObservingCondition
import com.skytracker.app.data.model.WeatherResponse
import javax.inject.Inject
import javax.inject.Singleton

sealed class WeatherResult<out T> {
    data class Success<T>(val data: T) : WeatherResult<T>()
    data class Error(val message: String) : WeatherResult<Nothing>()
    object Loading : WeatherResult<Nothing>()
}

@Singleton
class WeatherRepository @Inject constructor(
    private val weatherApiService: WeatherApiService
) {
    private val apiKey = BuildConfig.OPENWEATHER_API_KEY

    suspend fun getCurrentWeather(lat: Double, lon: Double): WeatherResult<WeatherResponse> {
        return try {
            val response = weatherApiService.getCurrentWeather(lat, lon, apiKey)
            WeatherResult.Success(response)
        } catch (e: Exception) {
            WeatherResult.Error(e.message ?: "Erro ao buscar dados do tempo")
        }
    }

    suspend fun getForecast(lat: Double, lon: Double): WeatherResult<ForecastResponse> {
        return try {
            val response = weatherApiService.getForecast(lat, lon, apiKey)
            WeatherResult.Success(response)
        } catch (e: Exception) {
            WeatherResult.Error(e.message ?: "Erro ao buscar previsão do tempo")
        }
    }

    /**
     * Calculates a sky observing quality rating based on weather conditions.
     * Key factors: cloud cover, humidity, visibility, wind.
     */
    fun calculateObservingCondition(weather: WeatherResponse): SkyObservingCondition {
        val clouds = weather.clouds.all          // 0-100%
        val humidity = weather.main.humidity     // 0-100%
        val visibility = weather.visibility      // meters (max 10000)
        val wind = weather.wind.speed            // m/s

        var score = 100

        // Cloud cover is the most important factor
        score -= when {
            clouds >= 80 -> 50
            clouds >= 60 -> 35
            clouds >= 40 -> 20
            clouds >= 20 -> 10
            else -> 0
        }

        // Humidity affects seeing conditions
        score -= when {
            humidity >= 90 -> 20
            humidity >= 70 -> 10
            humidity >= 50 -> 5
            else -> 0
        }

        // Visibility (10000 = max/excellent)
        score -= when {
            visibility < 1000 -> 25
            visibility < 3000 -> 15
            visibility < 5000 -> 8
            visibility < 8000 -> 3
            else -> 0
        }

        // Wind affects seeing
        score -= when {
            wind >= 10 -> 10
            wind >= 6 -> 5
            wind >= 3 -> 2
            else -> 0
        }

        val rating = when {
            score >= 85 -> ObservingRating.EXCELLENT
            score >= 65 -> ObservingRating.GOOD
            score >= 45 -> ObservingRating.FAIR
            score >= 25 -> ObservingRating.POOR
            else -> ObservingRating.BAD
        }

        val description = buildString {
            when {
                clouds >= 70 -> append("Céu muito nublado. ")
                clouds >= 40 -> append("Céu parcialmente nublado. ")
                clouds >= 10 -> append("Poucas nuvens. ")
                else -> append("Céu limpo. ")
            }
            if (humidity >= 80) append("Alta umidade pode causar névoa. ")
            if (visibility < 5000) append("Visibilidade reduzida. ")
            if (wind >= 6) append("Vento moderado pode afetar o seeing. ")
        }

        return SkyObservingCondition(
            rating = rating,
            label = when (rating) {
                ObservingRating.EXCELLENT -> "Excelente para observação"
                ObservingRating.GOOD -> "Bom para observação"
                ObservingRating.FAIR -> "Razoável para observação"
                ObservingRating.POOR -> "Ruim para observação"
                ObservingRating.BAD -> "Péssimo para observação"
            },
            description = description.trim()
        )
    }
}
