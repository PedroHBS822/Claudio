package com.skytracker.app.data.model

import com.google.gson.annotations.SerializedName

data class ISSResponse(
    @SerializedName("message") val message: String,
    @SerializedName("timestamp") val timestamp: Long,
    @SerializedName("iss_position") val issPosition: ISSPosition
)

data class ISSPosition(
    @SerializedName("latitude") val latitude: String,
    @SerializedName("longitude") val longitude: String
) {
    fun latitudeDouble() = latitude.toDouble()
    fun longitudeDouble() = longitude.toDouble()
}

data class ISSPassResponse(
    @SerializedName("message") val message: String,
    @SerializedName("request") val request: ISSPassRequest,
    @SerializedName("response") val passes: List<ISSPass>
)

data class ISSPassRequest(
    @SerializedName("altitude") val altitude: Int,
    @SerializedName("datetime") val datetime: Long,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("passes") val passes: Int
)

data class ISSPass(
    @SerializedName("duration") val duration: Int,
    @SerializedName("risetime") val risetime: Long
)
