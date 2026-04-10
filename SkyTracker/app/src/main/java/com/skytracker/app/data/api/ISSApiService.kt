package com.skytracker.app.data.api

import com.skytracker.app.data.model.ISSResponse
import retrofit2.http.GET

interface ISSApiService {
    @GET("iss-now.json")
    suspend fun getCurrentPosition(): ISSResponse
}
