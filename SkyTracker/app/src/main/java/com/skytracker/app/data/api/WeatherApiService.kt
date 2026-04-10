package com.skytracker.app.data.api

import com.skytracker.app.data.model.ForecastResponse
import com.skytracker.app.data.model.WeatherResponse
import retrofit2.http.GET
import retrofit2.http.Query

interface WeatherApiService {

    @GET("weather")
    suspend fun getCurrentWeather(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double,
        @Query("appid") apiKey: String,
        @Query("lang") lang: String = "pt_br"
    ): WeatherResponse

    @GET("forecast")
    suspend fun getForecast(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double,
        @Query("appid") apiKey: String,
        @Query("cnt") count: Int = 8,   // next 24 hours (every 3h)
        @Query("lang") lang: String = "pt_br"
    ): ForecastResponse
}
