package com.skytracker.app.data.repository

import com.skytracker.app.data.api.ISSApiService
import com.skytracker.app.data.model.ISSResponse
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

sealed class ISSResult {
    data class Success(val data: ISSResponse) : ISSResult()
    data class Error(val message: String) : ISSResult()
    object Loading : ISSResult()
}

@Singleton
class ISSRepository @Inject constructor(
    private val issApiService: ISSApiService
) {
    // Polls ISS position every 5 seconds
    fun getISSPositionStream(): Flow<ISSResult> = flow {
        emit(ISSResult.Loading)
        while (true) {
            try {
                val response = issApiService.getCurrentPosition()
                emit(ISSResult.Success(response))
            } catch (e: Exception) {
                emit(ISSResult.Error(e.message ?: "Erro ao buscar posição da ISS"))
            }
            delay(5_000L)
        }
    }

    suspend fun getISSPositionOnce(): ISSResult {
        return try {
            val response = issApiService.getCurrentPosition()
            ISSResult.Success(response)
        } catch (e: Exception) {
            ISSResult.Error(e.message ?: "Erro ao buscar posição da ISS")
        }
    }
}
