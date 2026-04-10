package com.skytracker.app.ui.weather

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.skytracker.app.data.model.ForecastItem
import com.skytracker.app.data.model.ObservingRating
import com.skytracker.app.data.model.SkyObservingCondition
import com.skytracker.app.data.model.WeatherResponse
import com.skytracker.app.ui.theme.CardBackground
import com.skytracker.app.ui.theme.SpaceBlack
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun WeatherScreen(viewModel: WeatherViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val locationPermission = rememberPermissionState(android.Manifest.permission.ACCESS_FINE_LOCATION)

    LaunchedEffect(locationPermission.status.isGranted) {
        if (locationPermission.status.isGranted) {
            viewModel.onLocationGranted()
        }
    }

    if (!locationPermission.status.isGranted) {
        WeatherPermissionScreen { locationPermission.launchPermissionRequest() }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        WeatherHeader(uiState, onRetry = viewModel::retry)

        when {
            uiState.isLoading -> {
                Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            }
            uiState.errorMessage != null -> {
                ErrorCard(uiState.errorMessage!!, onRetry = viewModel::retry)
            }
            uiState.currentWeather != null -> {
                uiState.observingCondition?.let { ObservingConditionBanner(it) }
                uiState.currentWeather?.let { CurrentWeatherSection(it) }
                if (uiState.forecast.isNotEmpty()) {
                    ForecastSection(uiState.forecast)
                }
                AstronomyTipsSection(uiState.currentWeather!!)
            }
        }

        Spacer(Modifier.height(16.dp))
    }
}

@Composable
private fun WeatherHeader(uiState: WeatherUiState, onRetry: () -> Unit) {
    Surface(color = CardBackground, modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Clima para Observação",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary
                )
                if (uiState.cityName.isNotEmpty()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(uiState.cityName, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
            IconButton(onClick = onRetry) {
                Icon(Icons.Default.Refresh, "Atualizar", tint = MaterialTheme.colorScheme.primary)
            }
        }
    }
}

@Composable
private fun ObservingConditionBanner(condition: SkyObservingCondition) {
    val gradient = Brush.horizontalGradient(
        colors = listOf(
            condition.rating.color.copy(alpha = 0.3f),
            condition.rating.color.copy(alpha = 0.1f)
        )
    )
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(gradient)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Stars rating
                repeat(5) { i ->
                    Text(
                        text = if (i < condition.rating.stars) "★" else "☆",
                        fontSize = 20.sp,
                        color = condition.rating.color
                    )
                }
                Spacer(Modifier.width(8.dp))
                Text(
                    text = condition.label,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = condition.rating.color
                )
            }
            Spacer(Modifier.height(4.dp))
            Text(
                text = condition.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun CurrentWeatherSection(weather: WeatherResponse) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Text(
            text = "Condições Atuais",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        // Temperature card
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "${weather.main.tempCelsius()}°C",
                        fontSize = 48.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "Sensação: ${weather.main.feelsLikeCelsius()}°C",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    weather.weather.firstOrNull()?.let { cond ->
                        Text(
                            text = cond.description.replaceFirstChar { it.uppercase() },
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
                // Sunrise/sunset
                Column(horizontalAlignment = Alignment.End) {
                    val fmt = SimpleDateFormat("HH:mm", Locale.getDefault())
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.WbSunny, null, tint = Color(0xFFFDD835), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(fmt.format(Date(weather.sys.sunrise * 1000L)), style = MaterialTheme.typography.bodySmall)
                    }
                    Spacer(Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Bedtime, null, tint = Color(0xFFB39DDB), modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(fmt.format(Date(weather.sys.sunset * 1000L)), style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        // Grid of weather metrics
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            WeatherMetricCard(
                icon = Icons.Default.Cloud,
                label = "Nuvens",
                value = "${weather.clouds.all}%",
                color = cloudColor(weather.clouds.all),
                modifier = Modifier.weight(1f)
            )
            WeatherMetricCard(
                icon = Icons.Default.WaterDrop,
                label = "Umidade",
                value = "${weather.main.humidity}%",
                color = humidityColor(weather.main.humidity),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            WeatherMetricCard(
                icon = Icons.Default.Visibility,
                label = "Visibilidade",
                value = visibilityText(weather.visibility),
                color = visibilityColor(weather.visibility),
                modifier = Modifier.weight(1f)
            )
            WeatherMetricCard(
                icon = Icons.Default.Air,
                label = "Vento",
                value = "${"%.1f".format(weather.wind.speed)} m/s",
                color = windColor(weather.wind.speed),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            WeatherMetricCard(
                icon = Icons.Default.Compress,
                label = "Pressão",
                value = "${weather.main.pressure} hPa",
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f)
            )
            WeatherMetricCard(
                icon = Icons.Default.Thermostat,
                label = "Amplitude",
                value = "${weather.main.tempMin.minus(273.15).toInt()}° / ${weather.main.tempMax.minus(273.15).toInt()}°",
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun WeatherMetricCard(
    icon: ImageVector,
    label: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, null, tint = color, modifier = Modifier.size(24.dp))
            Spacer(Modifier.height(4.dp))
            Text(value, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = color)
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun ForecastSection(forecast: List<ForecastItem>) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            text = "Próximas 24 horas",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(8.dp)) {
                forecast.take(8).forEach { item ->
                    ForecastRow(item)
                    if (item != forecast.take(8).last()) {
                        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant, thickness = 0.5.dp)
                    }
                }
            }
        }
    }
}

@Composable
private fun ForecastRow(item: ForecastItem) {
    val fmt = SimpleDateFormat("HH:mm", Locale.getDefault())
    val time = fmt.format(Date(item.timestamp * 1000L))
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(time, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.width(48.dp))
        Spacer(Modifier.weight(1f))
        // Cloud indicator
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(cloudColor(item.clouds.all))
        )
        Spacer(Modifier.width(4.dp))
        Text("${item.clouds.all}%", style = MaterialTheme.typography.bodySmall, modifier = Modifier.width(36.dp))
        Spacer(Modifier.width(8.dp))
        Icon(Icons.Default.WaterDrop, null, tint = Color(0xFF64B5F6), modifier = Modifier.size(14.dp))
        Text("${item.main.humidity}%", style = MaterialTheme.typography.bodySmall, modifier = Modifier.width(36.dp))
        Spacer(Modifier.width(8.dp))
        Text(
            "${item.main.tempCelsius()}°",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.width(36.dp),
            textAlign = TextAlign.End
        )
    }
}

@Composable
private fun AstronomyTipsSection(weather: WeatherResponse) {
    val clouds = weather.clouds.all
    val humidity = weather.main.humidity
    val visibility = weather.visibility

    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "Dicas para Observação",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                val tips = buildAstronomyTips(clouds, humidity, visibility, weather.wind.speed)
                tips.forEach { tip ->
                    Row(modifier = Modifier.padding(vertical = 4.dp), verticalAlignment = Alignment.Top) {
                        Text(tip.first, fontSize = 16.sp, modifier = Modifier.padding(end = 8.dp))
                        Text(tip.second, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}

private fun buildAstronomyTips(
    clouds: Int, humidity: Int, visibility: Int, wind: Double
): List<Pair<String, String>> {
    val tips = mutableListOf<Pair<String, String>>()

    when {
        clouds < 10 -> tips += "✅" to "Céu limpo – ótimo para observação de estrelas, planetas e nebulosas."
        clouds < 30 -> tips += "🌤" to "Poucas nuvens – boa visibilidade, mas algumas estrelas podem ser ocultadas."
        clouds < 60 -> tips += "⛅" to "Parcialmente nublado – observe nos intervalos sem nuvens."
        else        -> tips += "☁" to "Muito nublado – observação visual prejudicada. Tente amanhã."
    }

    if (humidity > 80) {
        tips += "💧" to "Umidade alta ($humidity%) pode causar névoa e embaçar lentes de telescópio."
    }

    if (visibility < 5000) {
        tips += "🌫" to "Visibilidade reduzida (${visibilityText(visibility)}) – neblina ou poluição do ar."
    } else {
        tips += "👁" to "Boa visibilidade – ${visibilityText(visibility)} de alcance visual."
    }

    if (wind < 3) {
        tips += "🌙" to "Vento calmo – seeing atmosférico favorável para alta magnificação."
    } else if (wind >= 6) {
        tips += "💨" to "Vento moderado (${"%.1f".format(wind)} m/s) pode causar turbulência na imagem do telescópio."
    }

    tips += "🔭" to "O melhor horário para observar é após a meia-noite, quando a atmosfera é mais estável."
    tips += "🌑" to "Fase da lua afeta a visibilidade de objetos de céu profundo. Lua nova = céu mais escuro."

    return tips
}

private fun cloudColor(clouds: Int): Color = when {
    clouds < 20  -> Color(0xFF66BB6A)
    clouds < 50  -> Color(0xFFFFD54F)
    clouds < 80  -> Color(0xFFFF8A65)
    else         -> Color(0xFFEF5350)
}

private fun humidityColor(humidity: Int): Color = when {
    humidity < 50 -> Color(0xFF66BB6A)
    humidity < 70 -> Color(0xFF64B5F6)
    humidity < 85 -> Color(0xFFFF8A65)
    else          -> Color(0xFFEF5350)
}

private fun visibilityColor(visibility: Int): Color = when {
    visibility >= 8000 -> Color(0xFF66BB6A)
    visibility >= 5000 -> Color(0xFFFFD54F)
    visibility >= 2000 -> Color(0xFFFF8A65)
    else               -> Color(0xFFEF5350)
}

private fun windColor(wind: Double): Color = when {
    wind < 3  -> Color(0xFF66BB6A)
    wind < 6  -> Color(0xFFFFD54F)
    wind < 10 -> Color(0xFFFF8A65)
    else      -> Color(0xFFEF5350)
}

private fun visibilityText(meters: Int): String = when {
    meters >= 10000 -> "> 10 km"
    meters >= 1000  -> "${"%.1f".format(meters / 1000.0)} km"
    else            -> "$meters m"
}

@Composable
private fun ErrorCard(message: String, onRetry: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth().padding(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(Icons.Default.Warning, null, tint = MaterialTheme.colorScheme.error, modifier = Modifier.size(48.dp))
            Spacer(Modifier.height(8.dp))
            Text(message, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurface)
            Spacer(Modifier.height(12.dp))
            Button(onClick = onRetry) { Text("Tentar novamente") }
        }
    }
}

@Composable
private fun WeatherPermissionScreen(onRequest: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("🌤", fontSize = 64.sp, textAlign = TextAlign.Center)
        Spacer(Modifier.height(24.dp))
        Text(
            text = "Permissão de Localização",
            style = MaterialTheme.typography.headlineMedium,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(12.dp))
        Text(
            text = "Para obter as condições do tempo e avaliar se o céu está adequado para observação, precisamos da sua localização.",
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(Modifier.height(32.dp))
        Button(onClick = onRequest) { Text("Conceder Permissão") }
    }
}
